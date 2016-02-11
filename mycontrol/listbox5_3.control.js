
mui.init();
mui.plusReady(function() {
	var _view = plus.webview.currentWebview();
	var form = new SubmitForm();
	if(_view.action == 'edit'){
		form.initForUpdate();
	}else{
		form.initForCreate();
	}
});

function SubmitForm() {
	this.user = JSON.parse(plus.storage.getItem('userMes'));
}

SubmitForm.prototype.initForCreate = function() {
	this.loadWorkers();
	this.loadClasses();
	
	this.setCheckOn(new Date());
	
	var _this = this;
	
	document.getElementById('submitBtn').addEventListener('tap', function() {
		_this.create();
	}, false);
};

SubmitForm.prototype.initForUpdate = function() {
	this.loadWorkers();
	this.loadLastSubmittedDate();
	
	var _this = this;
	document.getElementById('submitBtn').addEventListener('tap', function() {
		_this.update();
	}, false);
};

SubmitForm.prototype.setCheckOn = function(checkOn) {
	document.getElementById('checkOn').value = new Date().Format("yyyy-MM-dd");
	
};

SubmitForm.prototype.setActionOn = function(actionOn) {
	document.getElementById('actionOn').value = new Date().Format("yyyy-MM-dd");
};

SubmitForm.prototype.loadWorkers = function() {
	var _this = this;
	_waiting = plus.nativeUI.showWaiting();
	_url = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetWorkerExtension&KgId=' + _this.user.KgId;
	mui.ajax(_url, {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			_waiting.close()
			if (data.Success == 10000) {
				_this.renderWorkers(data.RerurnValue)
			}
		},
		error: function() {
			_waiting.close()
			mui.alert("获取检查人失败，请检查网络", '提示')
		}
	});
};

SubmitForm.prototype.loadClasses = function() {
	var _this = this;
	_waiting = plus.nativeUI.showWaiting();
	_url = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetClassListByOrg&Id=' + _this.user.KgId;
	mui.ajax(_url, {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			_waiting.close()
			if (data.Success == 10000) {
				_this.renderClasses(data.RerurnValue)
			}
		},
		error: function() {
			_waiting.close()
			mui.alert("获取车牌列表失败，请检查网络", '提示')
		}
	});
};

SubmitForm.prototype.loadLastSubmittedDate = function() {
	var _this = this;
	_waiting = plus.nativeUI.showWaiting();
	_id = parseInt(plus.storage.getItem('key_4_1_id'), 10);
	console.log('_id:' +  plus.storage.getItem('key_4_1_id'));
	_id = 1;
	_url = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMHiddenDangerById&id=' + _id
	mui.ajax(_url, {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			_waiting.close()
			if (data.Success == 10000) {
				_this.lastForm = data.RerurnValue;
				_this.renderForm(data.RerurnValue)
			}
		},
		error: function() {
			_waiting.close()
			mui.alert("获取上次添加的项目失败，请检查网络", '提示')
		}
	});
};

SubmitForm.prototype.renderWorkers = function(workers) {
	var _length = workers.length;
	var _html;
	for (i = 0; i < _length; i++) {
		_html += '<option value="' + workers[i].WorkerExtensionId + '" >' + workers[i].Name + '</option>';
	}
	document.getElementById('checkMan').innerHTML += _html;

};

SubmitForm.prototype.renderClasses = function(classes) {
	var _length = classes.length;

	var _html;
	for (i = 0; i < _length; i++) {
		_html += '<option value="' + classes[i].ClassInfoID + '" >' + classes[i].ClassName + '</option>';
	}
	document.getElementById('classSelector').innerHTML += _html;
};

SubmitForm.prototype.renderForm = function(form) {
	
	this.setCheckOn(new Date(form.CheckDate));
	this.setFinishedOn(new Date(form.FinishTime));
	console.log(form.ExaminatorIdId);
	document.getElementById('checkMan').value = form.ExaminatorIdId;
	document.getElementById('responsible').value = form.PersonLiableId;
	document.getElementById('securityRisk').value = form.HiddenDangerRegister;
	document.getElementById('measure').value = form.Measures;
	document.getElementById('schedule').value = form.Situation;
	
};

SubmitForm.prototype.create = function() {

	if (!this.checkForm()){
		return;
	}
	
	var _this = this;
		
	var _json = this.createJson();
	console.log(_json);
	_wating = plus.nativeUI.showWaiting();
	mui.ajax('http://115.28.141.223:89/WebServices/KMService.ashx?Option=AddKMSchoolBusSafeHealthCheck', {
		type: 'post',
		dataType: 'json',
		data: {
			jsonStr: _json
		},
		timeout: 5000,
		success: function(data) {
			_wating.close();
			if (data.Success == 10000) {
				mui.alert('提交成功！', '提示', function() {
					console.log(data.RerurnValue.toString());
					plus.storage.setItem('key_5_3_id', data.RerurnValue.toString());
					mui.back();
				});
			}
			console.log(data.Message)
		},
		error: function() {
			_wating.close();
			mui.alert('提交失败！', '提示');
		}
	});
};

SubmitForm.prototype.update = function() {
	
	if (!this.checkWorkers()){
		return;
	}
	
	var _this = this;

	_wating = plus.nativeUI.showWaiting();
	_json = this.updateJson();
	_id = this.lastForm.HiddenDangerId;
	console.log(_json);
	console.log(_id);
	
	mui.ajax('http://115.28.141.223:89/WebServices/KMService.ashx?Option=UpdateKMHiddenDanger', {
		type: 'post',
		dataType: 'json',
		data: {
			jsonStr: _json,
			id: _id,
		},
		timeout: 5000,
		success: function(data) {
			_wating.close();
			console.log('ret:' + data.Success)
			if (data.Success == 10000) {
				mui.alert('更新成功！', '提示', function() {
					console.log(data.RerurnValue.toString());
					mui.back();
				});
			}
		},
		error: function() {
			_wating.close();
			mui.alert('提交失败！', '提示');
		}
	});
};

SubmitForm.prototype.checkForm = function(){
	var _this = this;
	
	var _checkMan = document.getElementById("checkMan").value;
	if (!_checkMan) {
		mui.alert("请选择检查人", "提示");
		return false;
	}
	
	
	var _class = document.getElementById("classSelector").value;
	if (!_class) {
		mui.alert("请选择班级", "提示");
		return false;
	}
	return true;
};

SubmitForm.prototype.getSelectedText = function(elementId) {
    var elt = document.getElementById(elementId);
    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}

SubmitForm.prototype.createJson = function() {
	return JSON.stringify({
		"TeleInterviewCheckId": 0,
		"OrganizationId": this.user.KgId,
        "CheckDate": document.getElementById('checkOn').value + "T14:08:25",
        "Rummager": document.getElementById('checkMan').value,
        "RummagerName": this.getSelectedText('checkMan'),
        "ClassInfoID": document.getElementById('classSelector').value,
        "InterviewCount": document.getElementById('count').value,
        "Individuation": document.getElementById('personalization').value,
        "ParentOpinion": document.getElementById('comment').value,
        "Implementation": document.getElementById('schedule').value,
        "Remark": document.getElementById('remark').value,
        "State": 1,
        	"CreatorId": this.user.UserId,
		"Creator": this.user.Name,
		"CreateDate": new Date().Format("yyyy-MM-ddThh:mm:ss"),
		"ModifyId": this.user.UserId,
		"Modifier": this.user.Name,
		"ModifyDate": new Date().Format("yyyy-MM-ddThh:mm:ss")		
	});
};

SubmitForm.prototype.updateJson = function() {
	console.log(this.lastForm);
	this.lastForm.CheckDate = document.getElementById("checkOn").value + "T00:00:00.1";
	this.lastForm.HiddenDangerRegister = document.getElementById("securityRisk").value;
	this.lastForm.Measures = document.getElementById("measure").value;
	this.lastForm.ExaminatorIdId = document.getElementById("checkMan").value;
	this.lastForm.PersonLiableId = document.getElementById("responsible").value;
	this.lastForm.FinishTime = document.getElementById("finishedOn").value + "T00:00:00";
	this.lastForm.Situation = document.getElementById("schedule").value;
	this.lastForm.ModifyDate = new Date().Format("yyyy-MM-ddThh:mm:ss");
	return JSON.stringify(this.lastForm);
};