(function() {
    //pageNum=10(一页的数据)  pageTotal（总页数） Data  总数据  pageNow(当前页)  DataCount 总数据长度  PageDataArray 当前页的数据
    var paging = {
        pageNum: 5,
        pageNow: 1,
        pageTotal: 0,
        Data: allData,
        DataCount: allData.length,
        PageDataArray: [],
        ElementDiv: [],


        //   计算页面数
        TotlePage: function() {
            // this.pageTotal=Math.ceil(this.DataCount/this.pageNum);
            // Math.ceil为向上取整
            if (this.DataCount % this.pageNum == 0) {
                this.pageTotal = parseInt(this.DataCount / this.pageNum);
            } else {
                this.pageTotal = parseInt(this.DataCount / this.pageNum + 1);
            }
            //这两个都可以用，只不过第二个比较底层。第一个比较简单
            // console.log(this.pageTotal);计算出总页数
        },

        //获取 当前页数据
        pageNowData: function(page) {
            var index = (page - 1) * this.pageNum; //转化为索引 但我在考虑是否为必要，是否可以直接对pagenow操作
            // console.log(index);
            // console.log(typeof(this.pageNow));
            this.PageDataArray = this.Data.slice(index, index + this.pageNum); //因为splice会对字符串本身产生影响，所以用slice
            // console.log(this.PageDataArray)
            // 思路为，一页显示pageNum组数据，page从第一页开始，但取数据从零开始

            // console.log(this.Data);
            // 调用判断数据是否是undifind函数
            this.DataToElement();
        },
        // 创建数据
        CreateElement: function() {
            /*动态创建10组元素*/
            // 只创建一次dom元素而不是每次取数据的时候都重新创建
            for (var i = 0; i < this.pageNum; i++) {
                var Data_parEle = document.createElement("div");
                Data_parEle.className = "title user-data";
                var ul_par = document.createElement("ul");
                for (var k = 0; k < 10; k++) {
                    var li_child = document.createElement("li");
                    li_child.innerHTML = "";
                    ul_par.appendChild(li_child);
                }
                // 建立10组div——ul——10*li，并将li设为ul的子集
                // appendChild() 追加子集
                Data_parEle.appendChild(ul_par);
                // 将ul设为div的子集
                document.getElementById("content").appendChild(Data_parEle);
                // 将创建的整套div设为 id为content的div中
                this.ElementDiv.push(Data_parEle);
                // console.log(this.ElementDiv);
                // push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
                Data_parEle.addEventListener("mouseover", function() {
                    this.setAttribute("id", "userover");
                });
                Data_parEle.addEventListener("mouseleave", function() {
                    this.setAttribute("id", "userleave");
                });
                // 添加用户交互事件 鼠标离开 鼠标进入
            }
        },
        // 如果没有数据， 隐藏没有数据的样式
        DataToElement: function() {
            // 将原始数据中的true 显示为是、 false显示为否  
            // 如果没有数据，隐藏没有数据的样式
            for (var i = 0; i < this.ElementDiv.length; i++) {
                var lichild = this.ElementDiv[i].children[0].children;
                // console.log(lichild)
                if (this.PageDataArray[i] == undefined) {
                    this.ElementDiv[i].style.display = "none";
                } else {
                    this.ElementDiv[i].style.display = "block";
                    // 防止用户从数据不全的页回到数据完全的页而无法全部显示的bug            
                    // 判读用户信息是否是email 和是否毕业返回汉字
                    var index = 0;
                    for (var key in this.PageDataArray[i]) {
                        // console.log(this.PageDataArray[i][key])
                        lichild[index].innerHTML = this.PageDataArray[i][key] == true ? "是" : this.PageDataArray[i][key] == false ? "否" : this.PageDataArray[i][key];
                        index++;
                        //  i为索引   key 为键值对  例如ID name  之类
                        // 关键之处，将之前分好的数据与写好的div绑定


                    }
                }
            }
        },




        NumBerInfo: function() {

            // 总页面数据赋值
            document.getElementsByClassName('totle')[0].children[0].innerHTML = this.pageTotal;
            // 将总页数给span赋值
            var btnNumber = document.getElementsByClassName('btnNumber')[0];
            // console.log(btnNumber);
            // console.log(this.pageNow)
            btnNumber.innerHTML = this.pageNumberli(this.pageNow, this.pageTotal);

            //   给分页添加色块
            var oldcolor = btnNumber.children[0];
            oldcolor.style.backgroundColor = "#1D9DEE";
            oldcolor.style.color = "white";

            // 默认的块的颜色为white  背景色为蓝色 （#1D9DEE）
            //利用算法  实现块的颜色的改变 算法会创建各种块 比较难理解
            var that = this;
            btnNumber.onclick = function() {
                    var new_li = event.target;

                    // console.log(new_li.nodeName);
                    // new_li.nodeName 获取的标签为大写，所以要用大写判断
                    if (new_li.nodeName == 'LI') {
                        // console.log(new_li.getAttribute('data-nobtn'))
                        // 判断内容是不为...，如果是直接跳过
                        if (new_li.getAttribute('data-nobtn')) {
                            return;
                            // 对于块 ' ... '直接跳过
                        }

                        oldcolor.style.backgroundColor = "transparent";
                        oldcolor.style.color = "black";
                        new_li.style.backgroundColor = "#1D9DEE";
                        new_li.style.color = 'white';
                        oldcolor = new_li;
                        that.pageNow = new_li.innerHTML;

                        // 调用当前页数据
                        that.pageNowData(new_li.innerHTML);
                        btnNumber.innerHTML = that.pageNumberli(that.pageNow, that.pageTotal);
                    } // 用现在的颜色来替换之前的颜色

                }
                // 点击下一页
            var downPage = document.getElementsByClassName('downPage')[0];
            // console.log(downPage)
            // 下一页按钮 
            downPage.onclick = function() {
                // console.log(1)
                if (that.pageNow >= that.pageTotal) {
                    return;
                    // 如果当前页为最大页数，返回，即不执行onclick
                }
                that.pageNow++;
                // console.log(that.pageNow);
                btnNumber.innerHTML = that.pageNumberli(that.pageNow, that.pageTotal);
                // 重新计算翻页按钮
                oldcolor = document.getElementById("libg");
                // 当前页的颜色已经写好
                that.pageNowData(that.pageNow);
                // 调用pageNowData() 来显示当前页的数据
            }

            //  点击上一页
            var topPage = document.getElementsByClassName('topPage')[0];
            // 上一页
            topPage.onclick = function() {
                if (that.pageNow <= 1) {
                    // 如果当前页数小于等于1,不执行onclick
                    return;
                }
                that.pageNow--;
                // btnNumber.innerHTML = that.pageNumberli(that.pageNow, that.pageTotal);
                oldcolor = document.getElementById("libg");
                that.pageNowData(that.pageNow);
            }
            var choose = document.getElementById('choose');
            // choose 为点击 跳转 来实现翻页功能
            var choose_value = document.getElementsByClassName('txtnum')[0];
            // console.log(choose_value.value); 
            choose.onclick = function() {
                that.pageNowData(choose_value.value);
                // btnNumber.innerHTML = that.pageNumberli(parseInt(choose_value.value), that.pageTotal);
                that.pageNow = parseInt(choose_value.value);

            }

        },
        pageNumberli: function(cur_page, totle_page) {
            // 翻页按钮的算法
            // cur_page 为当前页数  totle_page为总页数
            var res = "";
            // 12345
            // 1...17 18 19 20
            // 1... 12 13 14 15 16...20
            // 没有判断的话，会直接建立总页数个页码块
            console.log(cur_page)
            for (var i = 1; i <= totle_page; i++) {
                //  页数从第一页开始
                if (i == 2 && cur_page - 5 > 1) { //前缩页
                    // 根据规律，第一页和第十九页会直接显示出来
                    // cur_page - 5 > 1 代表缩页从当前页的后6页开始，且当前页数大于6时是才会缩页

                    i = cur_page - 5; //直接跳到当前页 -5 也就是开始缩页之后的地方
                    console.log(i)
                    res += "<li data-nobtn='true'>...</li>"; //显示缩页的符号
                } else if (i == cur_page + 5 && cur_page + 5 < totle_page) { //后缩页        

                    i = totle_page - 1;
                    // 缩页位置在总页数的倒数第二个
                    // 其它按照前缩页理解
                    // 给第六页添加...
                    res += "<li data-nobtn='true'>...</li>";
                } else {
                    if (i == cur_page) {
                        res += "<li id='libg' style='background-color: #1D9DEE; color: white;'>" + i + "</li>";
                    } else {

                        res += "<li>" + i + "</li>";
                    }
                }
            }
            return res;
        }
    }
    paging.TotlePage();
    paging.CreateElement();
    paging.pageNowData(1); //默认页数为1
    paging.NumBerInfo();
})(allData)