
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
				_this.loadLastSubmittedDate();
			}
		},
		error: function() {
			_waiting.close()
			mui.alert("获取检查人失败，请检查网络", '提示')
		}
	});
};


SecurityCheckForm.prototype.loadLastSubmittedDate = function() {
	var _view = plus.webview.currentWebview();
	console.log(_view.action);
	
	if(_view.action == 'edit'){
		var _this = this;
		_waiting = plus.nativeUI.showWaiting();
		_id = parseInt(plus.storage.getItem('key_logistics_patrol_id'), 10);
		console.log('_id:' +  plus.storage.getItem('key_logistics_patrol_id'));
		_url = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMPatrolRecordById&id=' + _id
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
	

	document.getElementById("checkMan").value = form.RummagerId;
	document.getElementById("item1").value = form.Item1Result;
	document.getElementById("item2").value = form.Item2Result;
	document.getElementById("item3").value = form.Item3Result;
	document.getElementById("item4").value = form.Item4Result;
	document.getElementById("item5").value = form.Item5Result;
	document.getElementById("item6").value = form.Item6Result;
	document.getElementById("item7").value = form.Item7Result;
	document.getElementById("item8").value = form.Item8Result;
	document.getElementById("measure").value = form.Measures;
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
	mui.ajax('http://115.28.141.223:89/WebServices/KMService.ashx?Option=AddKMPatrolRecord', {
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
					plus.storage.setItem('key_logistics_patrol_id', data.RerurnValue.toString());
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
	_id = this.lastForm.PatrolRecordId;
	console.log(_json);
	console.log(_id);
	
	mui.ajax('http://115.28.141.223:89/WebServices/KMService.ashx?Option=UpdateKMPatrolRecord', {
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
		mui.alert("请选择检查人", "提示");
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

        	"PatrolRecordId": 0,
        "OrganizationId": this.user.KgId,
        "RummagerId": document.getElementById("checkMan").value,
        "RummagerName": this.getSelectedText("checkMan"),
        "CheckDate": document.getElementById('checkOn').value + "T00:00:00",
     
        "Item1Result": document.getElementById("item1").value,
        "Item2Result": document.getElementById("item2").value,
        "Item3Result": document.getElementById("item3").value,
        "Item4Result": document.getElementById("item4").value,
        "Item5Result": document.getElementById("item5").value,
        "Item6Result": document.getElementById("item6").value,
        "Item7Result": document.getElementById("item7").value,
        "Item8Result": document.getElementById("item8").value,
        "Measures": document.getElementById("measure").value,    
        "Remark": document.getElementById("remark").value,
        
	   	"CreatorId": this.user.UserId,
		"Creator": this.user.Name,
		"CreateDate": new Date().Format("yyyy-MM-ddThh:mm:ss"),
		"ModifyId": this.user.UserId,
		"Modifier": this.user.Name,
		"ModifyDate": new Date().Format("yyyy-MM-ddThh:mm:ss")		
	});
};

SecurityCheckForm.prototype.updateJson = function() {
	
	
	return JSON.stringify({

        	"PatrolRecordId": this.lastForm.PatrolRecordId,
        "OrganizationId": this.lastForm.OrganizationId,
        "RummagerId": document.getElementById("checkMan").value,
        "RummagerName": this.getSelectedText("checkMan"),
        "CheckDate": document.getElementById('checkOn').value + "T00:00:00",
     
        "Item1Result": document.getElementById("item1").value,
        "Item2Result": document.getElementById("item2").value,
        "Item3Result": document.getElementById("item3").value,
        "Item4Result": document.getElementById("item4").value,
        "Item5Result": document.getElementById("item5").value,
        "Item6Result": document.getElementById("item6").value,
        "Item7Result": document.getElementById("item7").value,
        "Item8Result": document.getElementById("item8").value,
        "Measures": document.getElementById("measure").value,    
        "Remark": document.getElementById("remark").value,
        
	   	"CreatorId": this.lastForm.CreatorId,
		"Creator": this.lastForm.Creator,
		"CreateDate": this.lastForm.CreateDate,
		"ModifyId": this.user.UserId,
		"Modifier": this.user.Name,
		"ModifyDate": new Date().Format("yyyy-MM-ddThh:mm:ss")		
	});
	
};
