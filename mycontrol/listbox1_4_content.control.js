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
	this.workcontent = "http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMWorkSummaryById&id="
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
				document.getElementById('Title').innerText = data.RerurnValue.Title;
				document.getElementById('Remark').innerText = data.RerurnValue.Remark;
				document.getElementById('Creator').innerText = data.RerurnValue.Creator;
				document.getElementById('CreateDate').innerText = new Date(data.RerurnValue.CreateDate).Format('yyyy年MM月dd日 hh:mm');
				document.getElementById('Modifier').innerText = data.RerurnValue.Modifier;
				document.getElementById('ModifyDate').innerText = new Date(data.RerurnValue.ModifyDate).Format('yyyy年MM月dd日 hh:mm');
				document.getElementById('ConstitutorName').innerText = data.RerurnValue.ConstitutorName;
				document.getElementById('LogDate').innerText = new Date(data.RerurnValue.LogDate).Format('yyyy年MM月dd日 hh:mm');
				document.getElementById('AuditorName').innerText = data.RerurnValue.AuditorName;
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