mui.init();

mui.plusReady(function(){
	var systempage=new systemPage()
	   systempage.init()
})
function systemPage(){
	this.userMes = JSON.parse(plus.storage.getItem('userMes'));
	this.kgid = this.userMes.KgId;
	this.userName = this.userMes.Name;
	this.userId = this.userMes.UserId;
	this.worklisturl="http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMLeaderGroupListByOrg&Id="+this.kgid
	this.listtable=document.getElementById('listtable')
}
var P_type=systemPage.prototype;
P_type.init=function(){
	this.ajaxGetWorkList()
}
P_type.ajaxGetWorkList=function(){
	var self=this
	mui.ajax(this.worklisturl,{
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success:function(data){
			if(data.Success==10000){
				self.addWorkList(data.RerurnValue)
			}
		}
	})
}
P_type.addWorkList=function(data){
	var self=this
	var _html=""
	for(var i=0;i<data.length;i++){
		var a=i+1
		var _sex='男'
		if(data[i].Sex==0){
			 _sex='女'
		}
		_html+='<tr><td>'+a+'</td><td >'+data[i].MemberName+'</td><td align="center">'+data[i].Duty+'</td><td>'+data[i].Job+'</td><td>'+data[i].Telephone+'</td><td><button class="mui-btn btns" id="'+data[i].LeaderGroupId+'"  style="width:100%">查看</button></td></tr>'
	}
	self.listtable.innerHTML+=_html
	self.checkWorkContent()
}
P_type.checkWorkContent=function(){
var _btns	=document.querySelectorAll('.btns')
	for(i=0;i<_btns.length;i++){
		_btns[i].addEventListener('tap',function(){
			var _workid=this.getAttribute('id')
			mui.openWindow({
					url: "../pages/listbox4_aqldxz_content.html",
					id: "../pages/listbox4_aqldxz_content.html",
					styles: {
						top: '0px',
						bounce: 'none'
					},
					show: {
						aniShow: 'slide-in-top'
					},
					waiting: {
						autoShow: false
					},
					extras: {
						workid: _workid
					}
				})
		})
		
	}
}


