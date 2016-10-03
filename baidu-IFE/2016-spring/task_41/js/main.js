// 日历组件
(function () {
  window.calendarTool = function(node, earilest, latest,callBackFn) {
    // 选择器
    var gId = function(x) { return document.getElementById(x); };
    var $ = function(x){ return document.querySelector(x); };
    var $a = function(x){ return document.querySelectorAll(x); };
    //添加事件(兼容方式)
    function addEvent(dom,type,fn){
      //对于支持DOM2级事件处理程序addeventListener方法的浏览器
      if(dom.addEventListener){
        dom.addEventListener(type,fn,false);
      }else if(dom.attachEvent){
      //对于不支持addEventListener方法但支持attchEvent方法的浏览器  
        dom.attachEvent('on'+type,fn);
      }
      else{
      //对于不支持以上两种,但支持on+'事件名'的浏览器
        dom['on'+type]=fn;
      }
    }
    
    // 日历对象
    var calendar = {
      earliest: null,
      latest: null,
      pickDay: new Date(),
      monthLable: ["一月","二月","三月","四月","五月","六月",
        "七月","八月","九月","十月","十一月","十二月"],
      dateToString: function(date) {
        return date.toJSON().slice(0,10);
      },

      // 生成日历,传入高亮日期 getDate();
      showTheMonth: function() {
        //生成输入框
        var date = this.dateToString(this.pickDay);
        var insert = "<input type='text' id='dateInput' value='" + date + "'>";
        //生成年月表头
         insert += "<article id='calendarPanel'><header><input type='button' id='lastMonth'>" +
           "<h3 id='chooseBtn'>" + this.monthLable[this.pickDay.getMonth()] + 
           "<span>" + this.pickDay.getFullYear() + "</span></h3>" + 
           "<input type='button' id='nextMonth'></header>";
        //生成星期表头
        insert += "<header><p>Mon</p><p>Tue</p><p>Wed</p><p>Thu</p>" +
          "<p>Fri</p><p>Sat</p><p>Sun</p></header>";
        //生成每天表格
        insert += "<section id='pickDay' style='display:flex;flex-wrap:wrap;'>";
        var nextDay = new Date(this.pickDay);
        nextDay.setDate(1);
        var nextDayWeek = nextDay.getDay(); //当月1号的星期
        var fixWeek = [6,0,1,2,3,4,5,6];
        nextDay.setDate(1 - fixWeek[nextDayWeek]); //算出当张表格的第一个日期
        for (var i = 0; i < 42 ; i++) {
          var dateString = this.dateToString(nextDay);
          //调用日期上限判断函数，设置 illegalDay 的 class
          if (!this.inScope(nextDay, this.earliest, this.latest)) {
            insert += "<div data-date='" + dateString + "' class='illegalDay'>" +
              nextDay.getDate() + "</div>";
          // 设置面板内非当月的日期
          } else if (nextDay.getMonth() !== this.pickDay.getMonth()) {
            insert += "<div data-date='" + dateString + "' class='otherMonth'>" +
              nextDay.getDate() + "</div>";
          // 高亮选中的日期
          } else if(this.dateToString(this.pickDay) === dateString) {
            insert += "<div data-date='" + dateString + "' class='pickDay'>" +
              nextDay.getDate() + "</div>";
          } else {
            insert += "<div data-date='" + dateString + "'>" + nextDay.getDate() + "</div>";
          }
          nextDay.setDate(nextDay.getDate() + 1);
        }
        insert += "</section>";
        // 生成年份选择框
        insert += "<section id='pickYear' style='display:none;flex-wrap:wrap;'>" +
          "<header><input type='button' id='lastYear'>" +
          "<h3>" + this.pickDay.getFullYear() + "</h3>" + 
          "<input type='button' id='nextYear'></header>";
          // 生成月份选择框
        for (i = 0; i < this.monthLable.length ; i++) {
          var month = this.monthLable[i];
          insert += "<div data-month='" + i + "'>" + month + "</div>";
        }
        insert += "</section></article>";
          // 日期选择范围提示
        insert += "<p>选择范围：" + this.dateToString(this.earliest) + " ~ " +
          this.dateToString(this.latest) + "</p>";

        $(node).innerHTML = insert;
        // 更新日期输入框
        gId("dateInput").value = this.dateToString(this.pickDay); 
        this.allEvent();
      },

      /*
       显示年月选择界面
      pickYear: function() {
        var section = document.querySelector('#calendarPanel > section');
        section.innerHTML = insert;
      },
      */

      // 绑定事件
      allEvent: function() {
        var self = this;

        // 绑定年月选择按钮事件
        addEvent(gId('lastMonth'), 'click', function() {
          self.pickDay.setMonth(self.pickDay.getMonth() - 1);
          self.showTheMonth();
        });
        addEvent(gId('nextMonth'), 'click', function() {
          self.pickDay.setMonth(self.pickDay.getMonth() + 1);
          self.showTheMonth();
        });
        addEvent(gId('lastYear'), 'click', function() {
          self.pickDay.setYear(self.pickDay.getFullYear() - 1);
          $('#pickYear h3').innerHTML = self.pickDay.getFullYear();
        });
        addEvent(gId('nextYear'), 'click', function() {
          self.pickDay.setYear(self.pickDay.getFullYear() + 1);
          $('#pickYear h3').innerHTML = self.pickDay.getFullYear();
        });

        // 点击选择日期
        addEvent(gId("pickDay"),"click",function(x) {
          var tar = x.target;
          if (/data-date/.test(tar.attributes[0].name)) {
            // 调用日期上限判断函数
            if (!self.inScope(tar.dataset.date,self.earliest,self.latest)) {
              alert("超出日期选择范围了。");
              return;
            }
            self.pickDay = new Date(tar.dataset.date);
            self.showTheMonth();
            var timer = setTimeout(function() {
              gId('calendarPanel').style.display = "none";
            }, 500);
            self.callBack();
          }
        });

        // 点击选择月份
        addEvent(gId("pickYear"),"click",function(x) {
          var tar = x.target;
          if (tar.attributes[0] && /data-month/.test(tar.attributes[0].name)) {
            self.pickDay.setMonth(tar.dataset.month);
            self.showTheMonth();
          }
        });

        // 切换月年选择模式和日期选择模式事件
        addEvent(gId('chooseBtn'),'click',function() {
          if (gId('pickDay').style.display === "flex") {
            $('#pickDay').style.display = "none";
            $('#pickYear').style.display = "flex";
          } else {
            $('#pickDay').style.display = "flex";
            $('#pickYear').style.display = "none";
          }
        });

        // 输入框输入日期事件
        addEvent(gId("dateInput"),"keyup",function(x) {
          if (x.keyCode === 13) {
            var input = gId("dateInput");
            // 调用日期输入格式检查函数
            if (!self.inputCheck(input.value)) {
              alert("请按‘2016-04-01’格式输入日期");
              return;
            }
            // 调用检查日期是否在范围内，并提示
            if (!self.inScope(input.value, self.earliest, self.latest)) {
              alert("超出日期选择范围了。");
              return;
            }
            self.pickDay = new Date(input.value);
            self.showTheMonth();
            var timer = setTimeout(function() {
              gId('calendarPanel').style.display = "none";
            }, 500);
            self.callBack();
          }
        });

        // 点击输入框显示/隐藏日历面板
        addEvent(gId('dateInput'), 'click', function() {
          var calendar = document.getElementById('calendarPanel');
          var input = gId("dateInput");
          if ( calendar.style.display === "") {
            if (!self.inScope(input.value, self.earliest, self.latest)) {
              alert("超出日期选择范围了。");
              return;
            }
            calendar.style.display = "none";
          } else {
            calendar.style.display = "";
          }
        });
      },

      // 检查日期输入格式是否为‘2016-04-01’
      inputCheck: function(input) {
        return /^\d\d\d\d-\d\d-\d\d$/.test(input);
      },

      // 检查日期是否在范围内函数，传入 string 和 Date 均可
      inScope: function(checkDate,earliest,latest) {
        if (typeof checkDate === "string") {
          checkDate= new Date(checkDate);
        }
        if (earliest && latest && checkDate >= earliest && checkDate <= latest) {
          return true;
        } else if (earliest && !latest && checkDate >= earliest) {
          return true;
        } else if (!earliest && latest && checkDate <= latest) {
          return true;
        } else {
          return false;
        }
      },

      // callback 函数
      callBack: function() { },
      
      // 流程管理
      init: function() {
        if (earliest) { this.earliest = earliest; }
        if (latest) { this.latest = latest; }
        if (callBack) { this.callBack = callBack; }
        this.showTheMonth();
        gId('calendarPanel').style.display = "none";
      }
    };
    calendar.init();
  };
})();
