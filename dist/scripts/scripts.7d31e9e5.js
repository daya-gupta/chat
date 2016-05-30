"use strict";angular.module("stockApp",["ngCookies","ngResource","ngRoute","ngTouch","ui.bootstrap","ngLoadingSpinner"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/watchlist",{templateUrl:"views/watchlist.html",controller:"WatchlistCtrl",controllerAs:"watchlist"}).otherwise({redirectTo:"/"})}]),angular.module("stockApp").controller("MainCtrl",["$scope","$http","$q","$timeout","CommonFactory",function(a,b,c,d,e){function f(){j.days=[],j.price=[],j.volume=[],j.revenue=[],j.profit=[],b({method:"get",url:"https://www.screener.in/api/company/"+a.stock.id+"/prices/?what=years&period=3"}).then(function(c){j.price=c.data.prices,j.days=c.data.dates,_.each(j.days,function(a,b){j.days[b]=a.split(" ").join("-"),j.volume.push(null),j.profit.push(null),j.revenue.push(null)}),b({method:"get",url:"https://www.screener.in/api/company/"+a.stock.symbol}).then(function(a){if(a.data)for(var b in a.data.number_set.quarters[0][1]){var c=-1,d=b,f=String(d).split("-"),g=f[1],h=f[2],i=f[0],k=i+"/"+g+"/"+h;g=moment(k).format("ll").split(" ")[0],k=h+"-"+g+"-"+i;for(var l=0;7>l;l++)if(k=h-l+"-"+g+"-"+i,c=_.indexOf(j.days,k),-1!==c){j.profit[c]=Number(a.data.number_set.quarters[9][1][b]),j.revenue[c]=Number(a.data.number_set.quarters[0][1][b]);break}}e.renderChart(j)},function(a){e.toggleMessageVisibility("Something went wrong. Please try after some time !!",!1),console.log(a)})})}function g(a){var b=moment().subtract(a,"days").format("L").split("/"),c=b.shift();return b.splice(1,0,c),b.join("-"),b}function h(a){return _.meanBy(a,function(a){return a.y}).toFixed(2)}function i(){if("string"!=typeof a.stock.symbol)return a.stock.id=a.stock.symbol,void f();j.days=[],j.price=[],j.volume=[],j.revenue=[],j.profit=[],1===a.duration.radioModel&&(delete j.volume,delete j.revenue,delete j.profit,b({method:"get",url:"http://www.nseindia.com/charts/webtame/tame_intraday_getQuote_closing_redgreen.jsp?CDSymbol="+a.stock.symbol+"&Segment=CM&Series=EQ&CDExpiryMonth=&FOExpiryMonth=&IRFExpiryMonth=&CDDate1=&CDDate2=&PeriodType=2&Periodicity=1&Template=tame_intraday_getQuote_closing_redgreen.jsp"}).then(function(a){console.log(a);var b=null;a.data&&$(a.data).find("csv")&&$(a.data).find("csv").find("data")[0]&&(b=$($(a.data).find("csv").find("data")[0]).text().split(" "),_.each(b,function(a,b){b&&(a=_.compact(a.split(",")),j.days.push(a[0].split(":").splice(0,2).join(":")),j.price.push(Math.round(10*a[1])/10))}),e.renderChart(j))},function(a){console.log("Error!!")})),j.days=[],j.price=[],j.volume=[],j.revenue=[],j.profit=[];var c=a.stock.symbol,d=a.duration.radioModel>1095?a.duration.radioModel:1095,i=g(d+1),k=g(0);b({method:"get",cache:!0,url:"http://www.nseindia.com/live_market/dynaContent/live_watch/get_quote/getHistoricalData.jsp?symbol="+c+"&series=EQ&fromDate="+i+"&toDate="+k}).then(function(d){var f=$(d.data),g=_.compact($(f[4]).find("tr")),i=Math.round(.7*a.duration.radioModel);g.splice(0,1);g=g.slice(0,i).reverse(),angular.forEach(g,function(a,b){var c=$(a).find("td");j.days.push(c[0].innerHTML),j.price.push(Number(c[7].innerHTML.replace(/,/g,""))),j.volume.push(Number(c[8].innerHTML.replace(/,/g,""))/1e3),j.price[b]>j.price[b-1]||0===b?j.volume[b]={y:j.volume[b],color:"#44B544"}:j.volume[b]={y:j.volume[b]},j.profit.push(null),j.revenue.push(null)}),b({method:"get",url:"https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/GetQuote.jsp?symbol="+c+"&illiquid=0&smeFlag=0&itpFlag=0"}).then(function(d){var f=null,g=null,i=0;i=h(j.volume.slice(j.volume.length>22?j.volume.length-22:0,j.volume.length)),g=$(d.data).find("#responseDiv"),g&&g.length&&(f=JSON.parse(g.text()).data[0],f.secDate&&f.secDate.slice(0,2)!=moment().date()&&(j.days.push(moment().date()),j.price.push(Number(f.lastPrice.replace(/,/g,""))),j.price[j.price.length-1]>j.price[j.price.length-2]?j.volume.push({y:Number(f.totalTradedVolume.replace(/,/g,""))/1e3,color:"#44B544"}):j.volume.push({y:Number(f.totalTradedVolume.replace(/,/g,""))/1e3}),j.profit.push(null),j.revenue.push(null)),j.days.length>2&&(a.latestPriceVolumeData={price:j.price[j.price.length-1],relativePrice:Math.round((j.price[j.price.length-1]-j.price[j.price.length-2])/j.price[j.price.length-2]*1e4)/100,volume:j.volume[j.volume.length-1].y,averageVolume:i,relativeVolume:Math.round(j.volume[j.volume.length-1].y/i*100)/100}),a.duration.radioModel>1&&b({method:"get",url:"https://www.screener.in/api/company/"+c}).then(function(a){var b=-1;if(a.data)for(var c in a.data.number_set.quarters[0][1]){var d=c,f=String(d).split("-"),g=f[1],h=f[2],i=f[0],k=i+"/"+g+"/"+h;g=moment(k).format("ll").split(" ")[0],k=h+"-"+g+"-"+i;for(var l=0;7>l;l++)if(k=h-l+"-"+g+"-"+i,b=_.indexOf(j.days,k),-1!==b){j.profit[b]=Number(a.data.number_set.quarters[9][1][c]),j.revenue[b]=Number(a.data.number_set.quarters[0][1][c]);break}}e.renderChart(j)}))})},function(a){e.toggleMessageVisibility("Something went wrong. Please try after some time !!",!1)})}var j={days:[],price:[],volume:[]};a.$root.view="home",a.$root.stock||sessionStorage.getItem("selectedStock")?(a.stock=a.$root.stock||JSON.parse(sessionStorage.getItem("selectedStock")),sessionStorage.setItem("selectedStock",JSON.stringify(a.stock))):(a.stock={name:"Rajesh Exports",symbol:"RAJESHEXPO"},a.$root.stock=a.stock),a.latestPriceVolumeData=null,a.search={stock:[],selectedStock:null},a.duration={},sessionStorage.duration?a.duration.radioModel=Number(sessionStorage.getItem("duration")):a.duration.radioModel=365,a.updateSearch=function(){b.get("https://www.screener.in/api/company/search/?q="+a.search.selectedStock).then(function(b){a.search.stock=b.data})},a.onTypeaheadSelection=function(){a.showStockDetails()},a.durationChanged=function(){sessionStorage.setItem("duration",a.duration.radioModel),i()},a.addToWatchlist=function(){var c={name:a.stock.name,priority:"4",symbol:a.stock.symbol};b({method:"post",url:"http://localhost:4000/addStock",data:{stock:c}}).then(function(a){a&&a.data&&e.toggleMessageVisibility(a.data.message,a.data.saved)},function(a){e.toggleMessageVisibility("An error occured. Stock not added to watchlist !!",!1)})},a.showNote=function(){a.showNotes=!0,b({method:"get",url:"http://localhost:4000/getWatchlist"}).then(function(b){if(b.data&&b.data.length){var c=_.find(b.data,{symbol:a.stock.symbol});c?(delete c._id,a.stock=c):a.stock.note=null}})},a.saveNote=function(c){a.showNotes=!1,b({method:"post",url:"http://localhost:4000/editStock",data:{stock:a.stock}}).then(function(a){a&&a.data&&e.toggleMessageVisibility(a.data.message,a.data.saved)},function(a){e.toggleMessageVisibility("An error occured. View updated to previouly saved watchlist !!",!1)})},a.showStockDetails=function(){if(a.search.selectedStock){var b=_.find(a.search.stock,{name:a.search.selectedStock});a.search.selectedStock=null,a.stock={},b&&(a.stock.name=b.name,a.stock.id=b.id,a.stock.symbol=b.url.split("/")[2],a.$root.stock=a.stock,sessionStorage.setItem("selectedStock",JSON.stringify(a.stock)),isNaN(Number(b.url.split("/")[2]))?i():(e.toggleMessageVisibility("stock not listed in nse !!",!1),f()))}},a.openNewsPopup=function(){e.getNewsData(a.stock)},a.updateNseValue=function(){e.updateNseValue()},a.updateNseValue(),i()}]),angular.module("stockApp").controller("WatchlistCtrl",["$scope","$http","$timeout","$location","CommonFactory",function(a,b,c,d,e){function f(a,b){var c="new"===b?10:12,d="new"===b?0:2,e=0,f=angular.copy(a.volume).slice(a.volume.length-c,a.volume.length-d),g=angular.copy(a.price).slice(a.price.length-c,a.price.length-d);return _.each(f,function(a,b){b&&f[b-1]!=_.max(f)&&(e+=Number(g[b])>=Number(g[b-1])?f[b]*(1+.05*b):-f[b]*(1+.05*b))}),(e/a.averageVolume).toFixed(2)}function g(){b({method:"get",url:"http://localhost:4000/getWatchlist"}).then(function(c){a.editPageData.watchlist2=[],c.data&&c.data.length&&(a.editPageData.watchlist2=c.data),a.editPageData.watchlistCopy=angular.copy(a.editPageData.watchlist),_.each(a.editPageData.watchlist2,function(a){var c={days:[],price:[],volume:[]},d=null,g=null;if(isNaN(Number(a.symbol))){b({method:"get",url:"https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/GetQuote.jsp?symbol="+a.symbol+"&illiquid=0&smeFlag=0&itpFlag=0"}).then(function(i){d=$(i.data).find("#responseDiv"),b({method:"get",url:"http://www.nseindia.com/live_market/dynaContent/live_watch/get_quote/getHistoricalData.jsp?symbol="+a.symbol+"&series=EQ&fromDate="+j+"&toDate="+k}).then(function(b){var e=$(b.data),i=$(e[4]).find("tr");i.splice(0,1);angular.forEach(_.reverse(i),function(a,b){var d=$(a).find("td");c.days.push(d[0].innerHTML),c.price.push(Number(d[7].innerHTML.replace(/,/g,""))),c.volume.push(Number(d[8].innerHTML.replace(/,/g,""))/1e3)}),c.averageVolume=Math.round(100*_.mean(c.volume))/100,d&&d.length&&(g=JSON.parse(d.text()).data[0],g.secDate&&g.secDate.slice(0,2)!=moment().date()&&(c.price.push(g.lastPrice.replace(/,/g,"")),c.volume.push(g.totalTradedVolume.replace(/,/g,"")/1e3))),a.volumeCriteriaOld=Number(f(c,"old")),a.volumeCriteriaNew=Number(f(c,"new")),a.price=c.price[c.price.length-1],a.volume=c.volume[c.volume.length-1],a.changeInVolume=c.averageVolume?Math.round(c.volume[c.volume.length-1]/c.averageVolume*100)/100:"NA",a.changeInPrice=c.price[c.price.length-2]?Math.round((c.price[c.price.length-1]-c.price[c.price.length-2])/c.price[c.price.length-2]*1e4)/100:"NA",h.push(c)},function(a){e.toggleMessageVisibility("Something went wrong. Please try after some time !!",!1)})});var i=30,j=e.formatDate(i+1),k=e.formatDate(0)}else a.price="NA",a.changeInPrice="NA",a.volume="NA"})},function(a){e.toggleMessageVisibility(a.data.message,!1)})}var h=[];a.$root.view="watchlist",a.search={stock:[],selectedStock:null},a.editPageData={predicate:"priority",reverse:!1,currentStock:null,watchlist2:[],watchlistCopy:null},a.redirectToDetailsPage=function(b){a.$root.stock=b,d.path("/#")},a.saveStockData=function(){return arguments&&arguments[0]===!1?(a.editPageData.currentStock=null,a.search.selectedStock=null,void(a.mode=null)):void(a.editPageData.currentStock&&(delete a.editPageData.currentStock._id,delete a.editPageData.currentStock.price,delete a.editPageData.currentStock.changeInPrice,delete a.editPageData.currentStock.volume,b({method:"post",url:"add"===a.mode?"http://localhost:4000/addStock":"http://localhost:4000/editStock",data:{stock:a.editPageData.currentStock}}).then(function(a){a&&a.data&&(e.toggleMessageVisibility("Data saved successfully",!0),g())},function(b){a.editPageData.watchlist2=a.editPageData.watchlistCopy,e.toggleMessageVisibility("An error occured. View updated to previouly saved watchlist !!",!1)}),a.mode=null,a.search.selectedStock=null,a.editPageData.currentStock=null))},a.onTypeaheadSelection=function(){if(a.search.selectedStock){var b=_.find(a.search.stock,{name:a.search.selectedStock});b&&(a.editPageData.currentStock.name=b.name,a.editPageData.currentStock.id=b.id,a.editPageData.currentStock.symbol=b.url.split("/")[2])}},a.updateSearch=function(){b.get("https://www.screener.in/api/company/search/?q="+a.search.selectedStock).then(function(b){a.search.stock=b.data})},a.addStock=function(){a.mode="add",a.editPageData.currentStock={name:null,note:null,symbol:null,price:null,priority:null}},a.editStock=function(b){a.mode="edit",a.editPageData.currentStock=b},a.deleteStock=function(c){a.editPageData.currentStock=c,b({method:"post",url:"http://localhost:4000/deleteStock",data:{stock:a.editPageData.currentStock}}).then(function(b){a.editPageData.currentStock=null,b&&b.data&&b.data.saved&&(a.editPageData.watchlist2=_.reject(a.editPageData.watchlist2,{symbol:c.symbol}),e.toggleMessageVisibility("Data removed successfully",!0))},function(b){a.editPageData.currentStock=null,e.toggleMessageVisibility("An error occured. View updated to previouly saved watchlist !!",!1)})},a.orderBy=function(b){a.editPageData.reverse=a.editPageData.predicate===b?!a.editPageData.reverse:!1,a.editPageData.predicate=b},a.updateNseValue=function(){e.updateNseValue()},a.openNewsPopup=function(a){e.getNewsData(a)},a.updateNseValue(),g()}]),angular.module("stockApp").factory("CommonFactory",["$rootScope","$http","$timeout",function(a,b,c){function d(a){var b=moment().subtract(a,"days").format("L").split("/"),c=b.shift();return b.splice(1,0,c),b.join("-"),b}function e(){b.get("https://www1.nseindia.com/homepage/Indices1.json").then(function(b){a.rootScopeData.valueNse=b.data.data[1].lastPrice,a.rootScopeData.changeNse=b.data.data[1].change,a.rootScopeData.pChangeNse=b.data.data[1].pChange})}function f(b,d){j&&c.cancel(j),a.rootScopeData.messageString=b,a.rootScopeData.messageStatus=d,j=c(function(){a.rootScopeData.messageString=null},4e3)}function g(a){$(function(){$("#chart-container").highcharts({chart:{zoomType:"xy"},title:{text:"Stocks price - volume - earnings graph"},subtitle:{text:"Source: NA"},xAxis:[{categories:a.days,crosshair:!0}],yAxis:[{labels:{format:"Rs {value}",style:{color:Highcharts.getOptions().colors[0]}},title:{text:"Price",style:{color:Highcharts.getOptions().colors[0]}},max:_.max(a.price),min:_.min(a.price)},{labels:{format:"{value} Cr",style:{color:Highcharts.getOptions().colors[1]}},title:{text:"revenue",style:{color:Highcharts.getOptions().colors[1]}}},{title:{text:"Volume (thousand)",style:{color:Highcharts.getOptions().colors[1]}},labels:{style:{color:Highcharts.getOptions().colors[1]}},opposite:!0},{gridLineWidth:0,title:{text:"Profit",style:{color:Highcharts.getOptions().colors[1]}},labels:{format:"{value} Cr",style:{color:Highcharts.getOptions().colors[1]}},opposite:!0}],tooltip:{shared:!0,positioner:function(){return{x:800,y:0}},shadow:!1,borderWidth:0},legend:{},series:[{name:"Volume",type:"column",yAxis:2,data:a.volume,tooltip:{valueSuffix:" ths"},color:Highcharts.getOptions().colors[3]},{name:"price",type:"area",yAxis:0,data:a.price,tooltip:{valueSuffix:""},color:Highcharts.getOptions().colors[0],fillColor:{linearGradient:[0,0,0,200],stops:[[0,Highcharts.getOptions().colors[0]],[1,Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get("rgba")]]}},{name:"profit",type:"spline",connectNulls:!0,yAxis:3,data:a.profit||[],dashStyle:"shortdot",tooltip:{valueSuffix:" Cr"},color:Highcharts.getOptions().colors[2]},{name:"revenue",type:"column",connectNulls:!0,yAxis:1,data:a.revenue||[],dashStyle:"shortdot",tooltip:{valueSuffix:" Cr"},color:Highcharts.getOptions().colors[1]}]})})}function h(a){var c=[];$("#myModalLabel").text(a.name),b.get("http://www.bseindia.com/SiteCache/1D/GetQuoteData.aspx?Type=EQ&text="+a.symbol).then(function(a){c=$(a.data),c=$(c.find("li a")[0]).attr("href").split("/"),c=c[c.length-2],b({method:"get",url:"http://www.bseindia.com/stock-share-price/Notification.aspx?scripcode="+c}).then(function(a){if(a&&a.data){var b=$(a.data).find("#divNotification");b=$(b.find("tr")),b.splice(0,2),console.log(b),$("#notification").html(b)}},function(){i.toggleMessageVisibility("An error occured while fetching news. !!",!1)}),b({method:"get",url:"http://www.bseindia.com/stock-share-price/SiteCache/TabResult.aspx?text="+c+"&type=news"}).then(function(a){if(a&&a.data){console.log($(a.data));var b=$(a.data).find("table");b=$(b.find("tr")),$("#news").html(b)}},function(){i.toggleMessageVisibility("An error occured while fetching news. !!",!1)})})}var i=null;a.rootScopeData={valueNse:null,changeNse:null,pChangeNse:null,messageString:null,messageStatus:null};var j=null;return i={formatDate:d,updateNseValue:e,toggleMessageVisibility:f,renderChart:g,getNewsData:h}}]),angular.module("stockApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/edit.html",'<p>This is edit page.</p> <div class=""> <table class="table"> <tr> <th>Quarter</th> <th>Date</th> <th>Revenue</th> <th>Profit</th> </tr> <tr ng-repeat="item in stockProfile"> <td class="col-sm-3"> <!-- dropdown for quater selection --> <select class="form-control" ng-model="item.quarter"> <option value="-1">--Quarter--</option> <option value="Q1">Q1</option> <option value="Q2">Q2</option> <option value="Q3">Q3</option> <option value="Q4">Q4</option> </select> </td> <td class="col-sm-3"> <!-- datepicker for result declaration date selection --> <div class="input-group"> <input type="text" class="form-control" uib-datepicker-popup="{{format}}" ng-model="item.date" is-open="item.opened" datepicker-options="dateOptions" ng-required="true" close-text="Close" alt-input-formats="altInputFormats"> <span class="input-group-btn"> <button type="button" class="btn btn-default" ng-click="item.opened = !item.opened"><i class="glyphicon glyphicon-calendar"></i></button> </span> </div> </td> <td class="col-sm-2"> <input class="form-control" type="text" ng-model="item.revenue"> </td> <td class="col-sm-2"> <input class="form-control" type="text" ng-model="item.profit"> </td> <td class="col-sm-1"> <input class="btn btn-primary" type="button" value="Add Row (+)" ng-click="alterRecord(\'add\', $index)"> </td> <td class="col-sm-1"> <input class="btn btn-primary" type="button" value="Remove Row (-)" ng-click="alterRecord(\'remove\', $index)"> </td> </tr> </table> <input class="btn btn-primary" ng-hide="stockProfile.length" type="button" value="Add Row (+)" ng-click="alterRecord(\'add\', 0)"> <input class="btn" type="button" value="Cancel" ng-click="saveRecord(\'cancel\')"> <input class="btn btn-primary" type="button" value="Save Changes" ng-click="saveRecord(\'save\')"> </div> <!-- savedStockProfile: {{savedStockProfile}} --> <br><br> <!-- stockProfile: {{stockProfile}} -->'),a.put("views/main.html",'<div id="container"> <input type="button" value="Search" class="btn" ng-class="{\'btn-primary\': search.selectedStock}" style="float:right; margin-left: 5px" ng-click="showStockDetails()"> <div style="float: right"> <input type="text" ng-change="updateSearch()" ng-model="search.selectedStock" placeholder="search stock" uib-typeahead="stock.name for stock in search.stock | filter:$viewValue | limitTo:5" typeahead-on-select="onTypeaheadSelection()" class="form-control"> </div> <input type="button" value="Add to Watchlist" class="btn" ng-class="" style="float:right; margin-left: 5px" ng-click="addToWatchlist()"> <h1> <span style="font-size: 18px"> {{stock.name}} ({{stock.symbol}}) </span> <a class="btn btn-lg" ng-click="openNewsPopup()" data-toggle="modal" data-target="#newsModal"> News </a> </h1> <div class="duration-container"> <div class="btn-group"> <label class="btn btn-primary" ng-model="duration.radioModel" ng-change="durationChanged()" uib-btn-radio="1">1 Day</label> <label class="btn btn-primary" ng-model="duration.radioModel" ng-change="durationChanged()" uib-btn-radio="7">1 Week</label> <label class="btn btn-primary" ng-model="duration.radioModel" ng-change="durationChanged()" uib-btn-radio="15">2 Week</label> <label class="btn btn-primary" ng-model="duration.radioModel" ng-change="durationChanged()" uib-btn-radio="30">1 Month</label> <label class="btn btn-primary" ng-model="duration.radioModel" ng-change="durationChanged()" uib-btn-radio="90">3 Month</label> <label class="btn btn-primary" ng-model="duration.radioModel" ng-change="durationChanged()" uib-btn-radio="180">6 Month</label> <label class="btn btn-primary" ng-model="duration.radioModel" ng-change="durationChanged()" uib-btn-radio="365">1 Year</label> <label class="btn btn-primary" ng-model="duration.radioModel" ng-change="durationChanged()" uib-btn-radio="1095">3 Year</label> <label class="btn btn-primary" ng-model="duration.radioModel" ng-change="durationChanged()" uib-btn-radio="1825">5 Year</label> </div> </div> <div id="chart-container"> <span ng-show="!chartData.days.length">No Data Available</span> </div> <div ng-show="latestPriceVolumeData"> <ul> <li>Price: {{latestPriceVolumeData.price}} ( <span class="bold" ng-class="{positivePriceChange: latestPriceVolumeData.relativePrice > 0, negativePriceChange: latestPriceVolumeData.relativePrice < 0}"> {{latestPriceVolumeData.relativePrice}}% </span>) </li> <li>Volume: {{latestPriceVolumeData.volume}} ( <span class="bold" ng-class="{positivePriceChange: latestPriceVolumeData.relativeVolume > 1, negativePriceChange: latestPriceVolumeData.relativeVolume < 1}"> {{latestPriceVolumeData.relativeVolume}} times </span>) </li> <li>Average Volume: {{latestPriceVolumeData.averageVolume}}</li> </ul> </div> <!-- <div id="tabular-data">\r\n	   No Data Available\r\n	   <table class="table table-striped table-bordered"></table>\r\n	</div> --> <div class="row notes" ng-init="showNotes=false"> <div class="col-sm-10"> <textarea class="textarea" ng-show="showNotes" ng-model="stock.note" placeholder="Add notes" rows="6">notes</textarea> </div> <div class="col-sm-2 row"> <input class="btn btn-primary col-sm-12" ng-show="!showNotes" ng-click="showNote()" type="button" value="Show Notes"> <input class="btn btn-primary col-sm-12" ng-show="showNotes" ng-click="showNotes=false" type="button" value="Hide Notes"> <input class="btn btn-primary col-sm-12" ng-show="showNotes" ng-click="saveNote()" type="button" value="Save"> <input class="btn btn-primary col-sm-12" ng-show="showNotes" ng-click="showNotes=false" type="button" value="Cancel"> </div> </div> <!-- Modal --> <div class="modal fade" id="newsModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="myModalLabel"></h4> </div> <div class="modal-body"> <h3>Notification:</h3> <table class="table table-bordered" id="notification"> </table> <h3>News:</h3> <table class="table table-bordered" id="news"> </table> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Done</button> <!-- <button type="button" class="btn btn-primary">Save changes</button> --> </div> </div> </div> </div> </div>'),a.put("views/watchlist.html",'<h3> Watchlist </h3> <div style="float: right; margin-top:-42px"> <input class="btn btn-primary" type="button" ng-disabled="editPageData.currentStock" value="Add New Stock (+)" ng-click="addStock()"> <input class="btn" type="button" ng-show="editPageData.currentStock" value="Cancel" ng-click="saveStockData(false)"> <input class="btn btn-primary" type="button" ng-show="editPageData.currentStock" value="Save" ng-click="saveStockData()" ng-disabled="!editPageData.currentStock.symbol"> </div> <div> <div ng-show="editPageData.currentStock" style="padding: 16px 8px; border: 1px solid #ccc; margin-bottom: 20px"> <div ng-show="mode==\'edit\'"> <h4> {{editPageData.currentStock.name}} </h4> <table class="table"> <tr> <th class="col-sm-2">Priority</th> <th class="col-sm-10">Notes</th> </tr> <tr> <td> <select name="priority" ng-model="editPageData.currentStock.priority" class="form-control"> <option value="-1">--Select--</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> </select> </td> <td> <input class="form-control" type="text" ng-model="editPageData.currentStock.note"> </td> </tr> </table> </div> <table ng-show="mode==\'add\'"> <tr> <th class="col-sm-1">Priority</th> <th class="col-sm-3">Stock Name</th> <th class="col-sm-8">Notes</th> </tr> <tr> <td> <select name="priority" ng-model="editPageData.currentStock.priority" class="form-control"> <option value="-1">--Select--</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> </select> </td> <td> <input type="text" ng-change="updateSearch()" ng-model="search.selectedStock" placeholder="search stock" uib-typeahead="stock.name for stock in search.stock | filter:$viewValue | limitTo:5" typeahead-on-select="onTypeaheadSelection()" class="form-control"> </td> <td> <input type="text" ng-model="editPageData.currentStock.note" placeholder="Note" class="form-control" style="width: 100%"> </td> </tr> </table> </div> <table class="table table-striped watchlist"> <tr> <th class="col-sm-1"> <span class="sort-handle" ng-click="orderBy(\'priority\')">Priority</span> <i ng-show="editPageData.predicate==\'priority\' && editPageData.reverse==true" class="fa fa-sort-asc" aria-hidden="true"></i> <i ng-show="editPageData.predicate==\'priority\' && editPageData.reverse==false" class="fa fa-sort-desc" aria-hidden="true"></i> </th> <th class="col-sm-2"> <span class="sort-handle" ng-click="orderBy(\'name\')">Stock Name</span> <i ng-show="editPageData.predicate==\'name\' && editPageData.reverse==true" class="fa fa-sort-asc" aria-hidden="true"></i> <i ng-show="editPageData.predicate==\'name\' && editPageData.reverse==false" class="fa fa-sort-desc" aria-hidden="true"></i> </th> <th class="col-sm-1 text-right"> <span class="sort-handle" ng-click="orderBy(\'changeInPrice\')">Price (%)</span> <i ng-show="editPageData.predicate==\'changeInPrice\' && editPageData.reverse==true" class="fa fa-sort-asc" aria-hidden="true"></i> <i ng-show="editPageData.predicate==\'changeInPrice\' && editPageData.reverse==false" class="fa fa-sort-desc" aria-hidden="true"></i> </th> <th class="col-sm-1 text-right"> <span class="sort-handle" ng-click="orderBy(\'changeInVolume\')">Volume (times)</span> <i ng-show="editPageData.predicate==\'changeInVolume\' && editPageData.reverse==true" class="fa fa-sort-asc" aria-hidden="true"></i> <i ng-show="editPageData.predicate==\'changeInVolume\' && editPageData.reverse==false" class="fa fa-sort-desc" aria-hidden="true"></i> </th> <th class="col-sm-1 text-right"> <span class="sort-handle" ng-click="orderBy(\'volumeCriteriaNew\')">Volume Criteria</span> <i ng-show="editPageData.predicate==\'volumeCriteriaNew\' && editPageData.reverse==true" class="fa fa-sort-asc" aria-hidden="true"></i> <i ng-show="editPageData.predicate==\'volumeCriteriaNew\' && editPageData.reverse==false" class="fa fa-sort-desc" aria-hidden="true"></i> </th> <th class="col-sm-4">Notes</th> <th class="col-sm-1">Edit</th> <th class="col-sm-1">Delete</th> </tr> <tr ng-repeat="item in editPageData.watchlist2 | orderBy:editPageData.predicate:editPageData.reverse"> <td> <span class="bold" ng-class="{\'priority-one\': item.priority == \'1\', \'priority-two\': item.priority == \'2\', \'priority-three\': item.priority == \'3\', \'priority-four\': item.priority == \'4\', \'priority-five\': item.priority == \'5\'}">{{item.priority}}</span> </td> <td> <span ng-click="redirectToDetailsPage(item)">{{item.name}}</span> <!-- <span ng-click="redirectToDetailsPage(item)">{{item.name}}</span> --> <a class="btn" ng-click="openNewsPopup(item)" data-toggle="modal" data-target="#newsModal"> News </a> </td> <td class="text-right"> {{item.price}} <span class="bold" ng-class="{\'positivePriceChange\': item.changeInPrice > 0, \'negativePriceChange\': item.changeInPrice < 0}"> ({{item.changeInPrice | number:2}}) </span> </td> <td class="text-right"> {{item.volume}} <span class="bold" ng-class="{\'positivePriceChange\': item.changeInVolume > 1, \'negativePriceChange\': item.changeInVolume < 1}"> ({{item.changeInVolume}}) </span> </td> <td class="text-right"> {{item.volumeCriteriaNew}} ({{item.volumeCriteriaOld}}) </td> <td> <div class="watchlist-note" title="{{item.note}}"> {{item.note}} </div> </td> <td> <button class="btn btn-primary" ng-click="editStock(item)"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit </button> </td> <td> <button class="btn btn-primary" ng-click="deleteStock(item)"> <i class="fa fa-times" aria-hidden="true"></i> Delete </button> </td> </tr> </table> <!-- Modal --> <div class="modal fade" id="newsModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="myModalLabel"></h4> </div> <div class="modal-body"> <h3>Notification:</h3> <table class="table table-bordered" id="notification"> </table> <h3>News:</h3> <table class="table table-bordered" id="news"> </table> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Done</button> <!-- <button type="button" class="btn btn-primary">Save changes</button> --> </div> </div> </div> </div> </div>')}]);