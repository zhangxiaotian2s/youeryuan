<<<<<<< HEAD
//LessonsCheck
mui.init();
mui.plusReady(function() {
	var slefwebiew = plus.webview.currentWebview();
	var action = slefwebiew.action;
	var hinterview = new homeInterview();
	if (action == 'new') {
		hinterview.initNew();
		hinterview.sendBtnTap();
	} else if (action == 'edit') {
		hinterview.initEdit();
		hinterview.sendBtnTap('edit');
	}
});

//厨房检查
function homeInterview() {
	this.teachersurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetWorkerExtension&'; //KgId=33&modifyTime=2015-01-01
	//	this.checklisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKitchenCheckItem&'; //KgId=33&KitchenCheckType=KitchenCheckType
	this.createurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=AddKMTeleInterviewCheck'; //&jsonStr=''  
	this.updateurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=UpdateKMTeleInterviewCheck'; //&jsonStr=''&id=
	this.editmesurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMTeleInterviewCheckById&id=';
	this.classlisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetClassListByOrg&Id=' //Id=33

	this.userMes = JSON.parse(plus.storage.getItem('userMes'));
	this.kgid = this.userMes.KgId;
	this.userName = this.userMes.Name;
	this.userId = this.userMes.UserId;
	this.DataDictionaryType = "KitchenCheckType";
	this.key_5_3_id = parseInt(plus.storage.getItem('key_5_3_id')) || 0;
	this.teacherlist = document.getElementById('teacherslist');
	this.classlist = document.getElementById('selectclass');
	this.checktime = document.getElementById('checktime')
	this.datateacherlist = JSON.parse(plus.storage.getItem('teacherlist'))
	this.dataclasslist = JSON.parse(plus.storage.getItem('classlist'))
	this.checktable = document.getElementById('check_Table');
	this.senbtn = document.getElementById('sendbtn');
	this.addbtn = document.getElementById('add_one');
	this.checkbox = document.getElementById('homeInterviewtab')
	this.wating = '';

	//非公共性的dome id
	this.InterviewCount = document.getElementById('InterviewCount');
	this.Individuation = document.getElementById('Individuation');
	this.ParentOpinion = document.getElementById('ParentOpinion');
	this.Implementation = document.getElementById('Implementation');
	this.Remark = document.getElementById('Remark');

}
var P_type = homeInterview.prototype;
P_type.initNew = function() {
	this.ajaxGetTeacherList();
	this.addTeacherList(this.datateacherlist)
	this.ajaxGetClassList();
	this.addClassList(this.dataclasslist)
	this.setCheckDate()
};
//页面打开时设置被选中的按钮的颜色 
P_type.initRadioParentBk = function() {
	this.radioinput = document.querySelectorAll('input[type="radio"]');
	this.radiosspan = document.querySelectorAll('.radio_span');
	for (i = 0; i < this.radioinput.length; i++) {
		if (this.radioinput[i].checked === true) {
			this.radioinput[i].parentElement.style.background = '#F0AD4E';
		} else {
			this.radioinput[i].parentElement.style.background = 'none';
		}
	}
};
P_type.ajaxGetTeacherList = function(editid) { //获取到的上次的修改人的id
	var self = this
	self.wating = plus.nativeUI.showWaiting()
	mui.ajax(this.teachersurl + 'KgId=' + self.kgid + '', {
=======

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
>>>>>>> origin/master
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
<<<<<<< HEAD
			self.wating.close()
			if (data.Success == 10000) {
				plus.storage.setItem('teacherlist', JSON.stringify(data.RerurnValue))
				self.datateacherlist = data.RerurnValue
				self.addTeacherList(self.datateacherlist)
				if (!self.datateacherlist) {
					self.addTeacherList(data.RerurnValue, editid)
				}
			}
		},
		error: function() {
			self.wating.close()
=======
			_waiting.close()
			if (data.Success == 10000) {
				_this.renderWorkers(data.RerurnValue)
			}
		},
		error: function() {
			_waiting.close()
>>>>>>> origin/master
			mui.alert("获取检查人失败，请检查网络", '提示')
		}
	});
};
<<<<<<< HEAD
P_type.addTeacherList = function(data, selectedvalue) {

	var _length = data.length;
	var _html;
	for (i = 0; i < _length; i++) {
		if (!selectedvalue) {
			_html += '<option value="' + data[i].WorkerExtensionId + '" >' + data[i].Name + '</option>';
		} else {
			if (data[i].WorkerExtensionId == selectedvalue) {
				_html += '<option value="' + data[i].WorkerExtensionId + '" selected>' + data[i].Name + '</option>';
			} else {
				_html += '<option value="' + data[i].WorkerExtensionId + '" >' + data[i].Name + '</option>';
			}
		}
	}
	this.teacherlist.innerHTML += _html;
};
P_type.ajaxGetClassList = function() {
	var self = this
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(self.classlisturl + self.kgid, {
		type: 'get',
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				plus.storage.setItem('classlist', JSON.stringify(data.RerurnValue))
				self.dataclasslist = data.RerurnValue
				self.addClassList(data.RerurnValue)
			}
		},
		error: function() {
			self.wating.close();
		}
	})
};
P_type.addClassList = function(data, selectedvalue) {
	var _length = data.length;
	var _html;
	for (i = 0; i < _length; i++) {
		if (!selectedvalue) {
			_html += '<option value="' + data[i].ClassInfoID + '" >' + data[i].ClassName + '</option>';
		} else {
			if (data[i].ClassInfoID == selectedvalue) {
				_html += '<option value="' + data[i].ClassInfoID + '" selected="selected">' + data[i].ClassName + '</option>';
			} else {
				_html += '<option value="' + data[i].ClassInfoID + '" >' + data[i].ClassName + '</option>';
			}
		}
	}
	this.classlist.innerHTML += _html;
};
//设置检查的默认时间
P_type.setCheckDate = function(checkdate) {
	if (checkdate) {
		this.checktime.value = checkdate.substr(0, 10)
		this.checktime.setAttribute('readonly', 'readonly')
		return
	}
	var nowtime = new Date()
	nowtime = nowtime.Format("yyyy-MM-dd")
	this.checktime.value = nowtime
};

P_type.addPreTeleInterviewData = function(data) {
	var self = this;
	self.Individuation
	var _length=	self.Individuation.options.length;
	for(i=0;i<_length;i++){
		 if(self.Individuation.options[i].value == data.Individuation){
		 	self.Individuation.options[i].selected=true; 
		 }
	}
	self.InterviewCount.value = data.InterviewCount;
	self.ParentOpinion.innerText = data.ParentOpinion;
	self.Implementation.innerText = data.Implementation;
    self.Remark.innerText = data.Remark;
}









//动态获取备课检查记录提交的数值
P_type.geSendArrValue = function(editdata) {
	var self = this;
	var _nowtime = new Date();
	_nowtime = _nowtime.Format("yyyy-MM-ddThh:mm:ss");
	var _RummagerName = self.teacherlist.options[self.teacherlist.selectedIndex].text,
		_Rummager = parseInt(self.teacherlist.value),
		_CheckDate = self.checktime.value + 'T00:00:00',
		_ClassInfoID = parseInt(self.classlist.value),
		_InterviewCount= parseInt(self.InterviewCount.value),
		_Individuation = parseInt(self.Individuation.value),
		_ParentOpinion = self.ParentOpinion.value,
		_Implementation = self.Implementation.value;
		_Remark = self.Remark.value,
		_TeleInterviewCheckId=0;
		if(editdata){
			_TeleInterviewCheckId =editdata.TeleInterviewCheckId;
		}
	//理论上讲 创建时间与检查时间都应该是首次创建该项的时间修改时间保持当前时间状态 

	return {
		"TeleInterviewCheckId": _TeleInterviewCheckId,
		"CheckDate": _CheckDate,
		"Rummager": _Rummager,
		"RummagerName": _RummagerName,
		"ClassInfoID": _ClassInfoID,
		"InterviewCount": _InterviewCount,
		"Individuation": _Individuation,
		"ParentOpinion": _ParentOpinion,
		"Implementation": _Implementation,
		"Remark": _Remark,
		"State": 1,
		"OrganizationId": self.kgid,
		"CreatorId": self.userId,
		"Creator": self.userName,
		"CreateDate": _CheckDate,
		"ModifyId": self.userId,
		"ModifyDate": _nowtime,
		"Modifier": self.userName
	}
	//	return sendjsonstr
}

//检查提交事件
P_type.sendBtnTap = function(edit) {
	var self = this;
	self.senbtn.addEventListener('tap', function() {
		if (edit == "edit") {
			self.ajaxSendCheckMES(self.editMes);
		} else {
			self.ajaxSendCheckMES();
		}
	}, false);
};
//ajax提交检查信息
P_type.ajaxSendCheckMES = function(editMES) {
	var self = this;
	var examinatorId = self.teacherlist.value;
	if (!examinatorId) {
		mui.alert("请选择检查人", "提示");
		return;
	}
	var _sendData, _sendurl;
	if (editMES) {
		_sendurl = self.updateurl;
		_sendData = self.geSendArrValue(editMES);
	} else {
		_sendurl = self.createurl;
		_sendData = self.geSendArrValue();
	}
	var _id =_sendData.TeleInterviewCheckId
	_sendData = (JSON.stringify(_sendData))
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(_sendurl, {
		type: 'post',
		dataType: 'json',
		data: {
			jsonStr: _sendData,
			id:_id
		},
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				mui.alert('提交成功！', '提示', function() {
					plus.storage.setItem('key_5_3_id', (data.RerurnValue).toString());
					mui.back();
				});
			}
		},
		error: function() {
			self.wating.close();
=======

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
>>>>>>> origin/master
			mui.alert('提交失败！', '提示');
		}
	});
};

<<<<<<< HEAD
///////edit
P_type.initEdit = function() {
	this.ajaxGetEditMes();
};
//获取上一次的修改的信息
P_type.ajaxGetEditMes = function() {
	var self = this;
	if (!self.key_5_3_id) {
		mui.alert('请新建一项才能编辑', '提示', function() {
			mui.back();
		});
		return;
	}

	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(self.editmesurl + self.key_5_3_id, {
		type: 'get',
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				console.log(JSON.stringify(data.RerurnValue))
				self.addTeacherList(self.datateacherlist, data.RerurnValue.Rummager);
				self.setCheckDate(data.RerurnValue.CheckDate)
				self.addClassList(self.dataclasslist, data.RerurnValue.ClassInfoID)
				self.addPreTeleInterviewData(data.RerurnValue);
				self.editMes = data.RerurnValue;
			}
		},
		error: function() {
			self.wating.close();
			mui.alert('请求超时，请检查网络', '提示');
		}
	});
=======
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
>>>>>>> origin/master
};