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
	this.createurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=AddKMHomeInterviewCheck'; //&jsonStr=''  
	this.updateurl = ' http://115.28.141.223:89/WebServices/KMService.ashx?Option=UpdateKMHomeInterviewCheck'; //&jsonStr=''&id=
	this.editmesurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMHomeInterviewCheckById&id=';
	this.classlisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetClassListByOrg&Id=' //Id=33

	this.userMes = JSON.parse(plus.storage.getItem('userMes'));
	this.kgid = this.userMes.KgId;
	this.userName = this.userMes.Name;
	this.userId = this.userMes.UserId;
	this.DataDictionaryType = "KitchenCheckType";
	this.key_5_4_id = parseInt(plus.storage.getItem('key_4_1_id')) || 0;
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
}
var P_type = homeInterview.prototype;
P_type.initNew = function() {
	this.ajaxGetTeacherList();
	this.addTeacherList(this.datateacherlist);
	this.ajaxGetClassList();
	this.addClassList(this.dataclasslist)

	this.setCheckDate()
	this.geSendArrValue()
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
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			self.wating.close()
			if (data.Success == 10000) {
				plus.storage.setItem('teacherlist', JSON.stringify(data.RerurnValue))
				self.datateacherlist = data.RerurnValue
				if (!self.datateacherlist) {
					self.addTeacherList(data.RerurnValue, editid)
				}
			}
		},
		error: function() {
			self.wating.close()
			mui.alert("获取检查人失败，请检查网络", '提示')
		}
	});
};
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
			if (data[i].WorkerExtensionId == selectedvalue) {
				_html += '<option value="' + data[i].ClassInfoID + '" selected>' + data[i].ClassName + '</option>';
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

P_type.addPreHomeInterviewData = function(editMes) {
	var self = this

}









//动态获取备课检查记录提交的数值
P_type.geSendArrValue = function(editdata) {
	var self = this;
	self.InterviewPersonCount = document.getElementById('InterviewPersonCount');
	self.InterviewTable = document.getElementById('InterviewTable');
	self.ParentOpinion = document.getElementById('ParentOpinion');
	self.Implementation = document.getElementById('Implementation');
	var _nowtime = new Date();
	_nowtime = _nowtime.Format("yyyy-MM-ddThh:mm:ss");
	var _RummagerName = self.teacherlist.options[self.teacherlist.selectedIndex].text,
		_RummagerId = parseInt(self.teacherlist.value),
		_CheckDate = self.checktime.value + 'T00:00:00',
		_ClassInfoID = parseInt(self.classlist.value),
		_InterviewPersonCount = parseInt(self.InterviewPersonCount.value),
		_InterviewTable = parseInt(self.InterviewTable.value),
		_ParentOpinion = self.ParentOpinion.innerHTML,
		_Implementation = self.Implementation.value;

	return {
		"HomeInterviewCheckId": 0,
		"CheckDate": _CheckDate,
		"RummagerId": _RummagerId,
		"RummagerName": _RummagerName,
		"ClassInfoID": _ClassInfoID,
		"InterviewPersonCount": _InterviewPersonCount,
		"InterviewTable": _InterviewTable,
		"ParentOpinion": _ParentOpinion,
		"Implementation": _Implementation,
		"State": 1,
		"CreatorId": self.userId,
		"Creator": self.userName,
		"CreateDate": _nowtime,
		"ModifyId": self.userId,
		"OrganizationId": self.kgid,
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
	_sendData=(JSON.stringify(_sendData))
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(_sendurl, {
		type: 'post',
		dataType: 'json',
		data: {
			jsonStr:_sendData
		},
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				plus.storage.setItem('key_4_1_id', (data.RerurnValue).toString());
				mui.alert('提交成功！', '提示', function() {
					mui.back();
				});
			}
		},
		error: function() {
			self.wating.close();
			mui.alert('提交失败！', '提示');
		}
	});
};

///////edit
P_type.initEdit = function() {
	this.ajaxGetTeacherList();
	this.ajaxGetClassList();
	this.ajaxGetEditMes();
};
//获取上一次的修改的信息
P_type.ajaxGetEditMes = function() {
	var self = this;
	self.key_5_4_id = 1 //临时处理
	if (!self.key_5_4_id) {
		mui.alert('请新建一项才能编辑', '提示', function() {
			mui.back();
		});
		return;
	}

	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(self.editmesurl + self.key_5_4_id, {
		type: 'get',
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				console.log(JSON.stringify(data.RerurnValue))
				self.addTeacherList(self.datateacherlist, data.RerurnValue.RummagerId);
				self.setCheckDate(data.RerurnValue.CheckDate)
				self.addClassList(self.dataclasslist, data.RerurnValue.ClassInfoID)
					//				self.addPreClassCheck(self.dataclasslist, self.datateacherlist, data.RerurnValue);
					//				self.editMes = data.RerurnValue;
			}
		},
		error: function() {
			self.wating.close();
			mui.alert('请求超时，请检查网络', '提示');
		}
	});
};