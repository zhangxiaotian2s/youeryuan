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

	this.workcontent = "http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetGuardianInfoById&id="
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
				document.getElementById('RelationshipName').innerText = data.RerurnValue.RelationshipName
				document.getElementById('GuardianlevelName').innerText = data.RerurnValue.GuardianlevelName
				document.getElementById('ChildId').innerText = data.RerurnValue.ChildId
				document.getElementById('Name').innerText = data.RerurnValue.Name
				document.getElementById('Birth').innerText = new Date(data.RerurnValue.Birth).Format('yyyy年MM月dd日')
				document.getElementById('DocumentType').innerText = data.RerurnValue.DocumentType
				document.getElementById('IdCard').innerText = data.RerurnValue.IdCard
				document.getElementById('Phone').innerText = data.RerurnValue.Phone
				document.getElementById('HomeAddress').innerText = data.RerurnValue.HomeAddress;
				document.getElementById('Email').innerText = data.RerurnValue.Email;
				document.getElementById('WxCode').innerText = data.RerurnValue.WxCode;
				document.getElementById('QQ').innerText = data.RerurnValue.QQ;

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