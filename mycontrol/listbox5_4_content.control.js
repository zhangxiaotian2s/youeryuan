mui.init();

mui.plusReady(function() {
	var systempage = new systemPage()
	var currentpage = plus.webview.currentWebview()
	systempage.init(currentpage.workid)
})

function systemPage() {
	this.userMes = JSON.parse(plus.storage.getItem('userMes'));
	this.kgid = this.userMes.KgId;
	this.userName = this.userMes.Name;
	this.userId = this.userMes.UserId;
	this.workcontent = " http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetChildInfoById&id="
}
var P_type = systemPage.prototype;
P_type.init = function(id) {
	this.ajaxGetWorkList(id)
}

P_type.ajaxGetWorkList = function(id) {
	var self = this
	mui.ajax(this.workcontent + id, {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			if (data.Success == 10000) {
				document.getElementById('ChildName').innerText = data.RerurnValue.ChildName;
				document.getElementById('SexName').innerText = data.RerurnValue.SexName
				document.getElementById('Presentaddress').innerText = data.RerurnValue.Presentaddress
				document.getElementById('WorkCardNo').innerText = data.RerurnValue.WorkCardNo
				document.getElementById('Channel').innerText = data.RerurnValue.Channel
				document.getElementById('FamilyBackground').innerText = data.RerurnValue.FamilyBackground
				document.getElementById('Birthday').innerText = new Date(data.RerurnValue.Birthday).Format('yyyy年MM月dd日')
				document.getElementById('Entrance').innerText = new Date(data.RerurnValue.Entrance).Format('yyyy年MM月dd日')
				document.getElementById('Standard').innerText = data.RerurnValue.Standard;
				
				

				//				self.addWorkList(data.RerurnValue)
			}
		}
	})
}
P_type.addWorkList = function(data) {
	var self = this
	var _html = ""
	for (var i = 0; i < data.length; i++) {
		var a = i + 1
		_html += '<tr><td>' + a + '</td><td>' + data[i].Title + '</td><td>' + data[i].Title + '</td><td>' + data[i].Title + '</td><td>' + data[i].Title + '</td><td>' + data[i].Title + '</td><td>' + data[i].Title + '</td><td>' + data[i].Title + '</td><td><button class="mui-btn btns" id="' + data[i].WorkingPlanId + '"  style="width:100%">查看</button></td></tr>'
	}
	self.listtable.innerHTML += _html
	self.checkWorkContent()
}