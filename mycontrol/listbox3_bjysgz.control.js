
mui.init();
mui.plusReady(function() {
	var _view = plus.webview.currentWebview();
	var form = new SecurityCheckForm();
	
	if(_view.action == 'edit'){
		form.initForUpdate();
	}else{
		
		form.initForCreate();
	}
});

function SecurityCheckForm() {
	this.user = JSON.parse(plus.storage.getItem('userMes'));
}

SecurityCheckForm.prototype.initForCreate = function() {
	this.loadWorkers();
	
	this.setCheckOn(new Date());
	
	var _this = this;
	
	document.getElementById('submitBtn').addEventListener('tap', function() {
		_this.create();
	}, false);
};

SecurityCheckForm.prototype.initForUpdate = function() {
	this.loadWorkers();

	
	var _this = this;
	document.getElementById('submitBtn').addEventListener('tap', function() {
		_this.update();
	}, false);
};
SecurityCheckForm.prototype.setCheckOn = function(checkOn) {
	document.getElementById('checkOn').value = new Date().Format("yyyy-MM-dd");
	
};

SecurityCheckForm.prototype.loadWorkers = function() {
	var _this = this;
	_waiting = plus.nativeUI.showWaiting();
	_url = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetWorkerExtension&KgId=' + _this.user.KgId;
	mui.ajax(_url, {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			_waiting.close();
			if (data.Success == 10000) {
				_this.renderWorkers(data.RerurnValue)
				_this.loadClasses();
			}
		},
		error: function() {
			_waiting.close()
			mui.alert("获取检查人失败，请检查网络", '提示')
		}
	});
};

SecurityCheckForm.prototype.loadClasses = function() {
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
				_this.renderClasses(data.RerurnValue);
				_this.loadLastSubmittedDate();
			}
		},
		error: function() {
			_waiting.close()
			mui.alert("获取车牌列表失败，请检查网络", '提示')
		}
	});
};

SecurityCheckForm.prototype.loadLastSubmittedDate = function() {
	var _view = plus.webview.currentWebview();
	console.log(_view.action);
	
	if(_view.action == 'edit'){
		var _this = this;
		_waiting = plus.nativeUI.showWaiting();
		_id = parseInt(plus.storage.getItem('listbox3_bjysgz_id'), 10);
		console.log('_id:' +  plus.storage.getItem('listbox3_bjysgz_id'));
		_url = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMHygieneById&id=' + _id
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
	}
};

SecurityCheckForm.prototype.renderWorkers = function(workers) {
	var _length = workers.length;
	var _html;
	for (i = 0; i < _length; i++) {
		_html += '<option value="' + workers[i].WorkerExtensionId + '" >' + workers[i].Name + '</option>';
	}
	document.getElementById('checkMan').innerHTML += _html;

};

SecurityCheckForm.prototype.renderClasses = function(classes) {
	var _length = classes.length;

	var _html;
	for (i = 0; i < _length; i++) {
		_html += '<option value="' + classes[i].ClassInfoID + '" >' + classes[i].ClassName + '</option>';
	}
	document.getElementById('class').innerHTML += _html;
};

SecurityCheckForm.prototype.renderForm = function(form) {
	
	this.setCheckOn(new Date(form.CheckDate));
	
	document.getElementById("checkMan").value = form.WatcherId;
	document.getElementById("class").value = form.ClassInfoID;
    document.getElementById("expect_count").value = form.Number;
    document.getElementById("checkin_count").value = form.CheckinNumber;
    document.getElementById("absense_cause").value = form.Absence;
    document.getElementById("restaurant").value = form.Diet;
    document.getElementById("nursing").value = form.Nursing;
    document.getElementById("table").value = form.Diet;
    document.getElementById("cleaning").value = form.InternalSecurity;
    document.getElementById("practice").value = form.Situation;
    document.getElementById("remark").value = form.Remark;
    
};

SecurityCheckForm.prototype.create = function() {

	if (!this.checkForm()){
		return;
	}
	
	var _this = this;
		
	var _json = this.createJson();
	console.log(_json);
	_wating = plus.nativeUI.showWaiting();
	mui.ajax('http://115.28.141.223:89/WebServices/KMService.ashx?Option=AddKMHygiene', {
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
					plus.storage.setItem('listbox3_bjysgz_id', data.RerurnValue.toString());
					mui.back();
				});
			}else{
				console.log(JSON.stringify(data));
			}
		},
		error: function() {
			_wating.close();
			mui.alert('提交失败！', '提示');
		}
	});		
};

SecurityCheckForm.prototype.update = function() {
	
	if (!this.checkForm()){
		return;
	}
	
	var _this = this;

	_wating = plus.nativeUI.showWaiting();
	_json = this.updateJson();
	_id = this.lastForm.HygieneId;
	console.log(_json);
	console.log(_id);
	
	mui.ajax('http://115.28.141.223:89/WebServices/KMService.ashx?Option=UpdateKMHygiene', {
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
SecurityCheckForm.prototype.checkForm = function(){
	var _this = this;
	
	var _checkMan = document.getElementById("checkMan").value;
	if (!_checkMan) {
		mui.alert("请选择值班人", "提示");
		return false;
	}
	
	var _operator = document.getElementById("class").value;
	if (!_operator) {
		mui.alert("请选择班级", "提示");
		return false;
	}
	
	
	return true;
};

SecurityCheckForm.prototype.getSelectedText = function(elementId) {
    var elt = document.getElementById(elementId);
    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}

SecurityCheckForm.prototype.createJson = function() {
	return JSON.stringify({
		"HygieneId": 0,
        "OrganizationId": this.user.KgId,
        "WatcherId": document.getElementById("checkMan").value,
        "WatcherName": this.getSelectedText("checkMan"),
        "ClassInfoID": document.getElementById("class").value,
        "ClassName": this.getSelectedText("class"),
        "CheckDate":  document.getElementById('checkOn').value + "T00:00:00",
        "Number": document.getElementById("expect_count").value,
        "CheckinNumber": document.getElementById("checkin_count").value,
        "Absence": document.getElementById("absense_cause").value,
        "Diet": document.getElementById("restaurant").value,
        "Nursing": document.getElementById("nursing").value,
        "Filling": document.getElementById("table").value,
        "InternalSecurity": document.getElementById("cleaning").value,
        "Situation": document.getElementById("practice").value,
        "Remark": document.getElementById("remark").value,
        "CheckDate": document.getElementById('checkOn').value + "T00:00:00",
        	"CreatorId": this.user.UserId,
		"Creator": this.user.Name,
		"CreateDate": new Date().Format("yyyy-MM-ddThh:mm:ss"),
		"ModifierId": this.user.UserId,
		"Modify": this.user.Name,
		"ModifyDate": new Date().Format("yyyy-MM-ddThh:mm:ss")		
	});
};

SecurityCheckForm.prototype.updateJson = function() {
	console.log(this.lastForm);
	
	this.lastForm.WatcherId = document.getElementById("checkMan").value;
	this.lastForm.WatcherName = this.getSelectedText("checkMan");
	this.lastForm.ClassInfoID = document.getElementById("class").value;
	this.lastForm.ClassName = this.getSelectedText("class");
	this.lastForm.CheckDate = document.getElementById('checkOn').value + "T00:00:00";
	this.lastForm.Number = document.getElementById("expect_count").value;
	this.lastForm.CheckinNumber = document.getElementById("checkin_count").value;
	this.lastForm.Absence = document.getElementById("absense_cause").value;
	this.lastForm.Diet = document.getElementById("restaurant").value;
	this.lastForm.Nursing = document.getElementById("nursing").value;
	this.lastForm.Filling = document.getElementById("table").value;
	this.lastForm.InternalSecurity = document.getElementById("cleaning").value;
	this.lastForm.Situation = document.getElementById("practice").value;
	this.lastForm.Remark = document.getElementById("remark").value;
	this.lastForm.ModifierId = this.user.UserId;
	this.lastForm.Modify = this.user.Name;
	this.lastForm.ModifyDate = new Date().Format("yyyy-MM-ddThh:mm:ss");
	
	return JSON.stringify(this.lastForm);
};
