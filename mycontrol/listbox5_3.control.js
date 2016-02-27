//LessonsCheck
mui.init();
mui.plusReady(function() {
	var slefwebiew = plus.webview.currentWebview();
	var action = slefwebiew.action;
	var systempage = new systemPage();
	if (action == 'new') {
		systempage.initNew();
		systempage.sendBtnTap();
	} else if (action == 'edit') {
		systempage.initEdit();
		systempage.sendBtnTap('edit');
	}
});

//厨房检查
function systemPage() {
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
	this.key_5_3_id = parseInt(plus.storage.getItem('key_5_3_id')) || 0;
	this.teacherlist = document.getElementById('teacherslist');
	this.classlist = document.getElementById('selectclass');
	this.checktime = document.getElementById('checktime')
	this.datateacherlist = JSON.parse(plus.storage.getItem('teacherlist'))
	this.dataclasslist = JSON.parse(plus.storage.getItem('classlist'))
	this.checktable = document.getElementById('check_Table');
	this.senbtn = document.getElementById('sendbtn');
	this.addbtn = document.getElementById('add_one');
	this.checkbox = document.getElementById('systemPagetab')
	this.wating = '';

	//非公共性的dome id
	this.InterviewPersonCount = document.getElementById('InterviewPersonCount');
	this.InterviewTable = document.getElementById('InterviewTable');
	this.ParentOpinion = document.getElementById('ParentOpinion');
	this.Implementation = document.getElementById('Implementation');

}
var P_type = systemPage.prototype;
P_type.initNew = function() {
	this.ajaxGetTeacherList();
	this.addTeacherList(this.datateacherlist);
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
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			self.wating.close()
			if (data.Success == 10000) {
				plus.storage.setItem('teacherlist', JSON.stringify(data.RerurnValue))
				if (!self.datateacherlist) {
					self.datateacherlist = data.RerurnValue
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
	if (!data) {
		return
	}
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
				if (!self.dataclasslist) {
					self.dataclasslist = data.RerurnValue
					self.addClassList(data.RerurnValue)
				}
			}
		},
		error: function() {
			self.wating.close();
		}
	})
};
P_type.addClassList = function(data, selectedvalue) {
	if (!data) {
		return
	}
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
		this.checktime.value = checkdate
		this.checktime.setAttribute('readonly', 'readonly')
		return
	}
	var nowtime = new Date()
	nowtime = nowtime.Format("yyyy-MM-ddThh:mm")
	this.checktime.value = nowtime
};

P_type.addPreHomeInterviewData = function(data) {
	var self = this;
	self.InterviewPersonCount.value = data.InterviewPersonCount;
	self.InterviewTable.value = data.InterviewTable;
	self.ParentOpinion.innerText = data.ParentOpinion;
	self.Implementation.innerText = data.Implementation;
}









//动态获取备课检查记录提交的数值
P_type.geSendArrValue = function(editdata) {
	var self = this;
	var _nowtime = new Date();
	_nowtime = _nowtime.Format("yyyy-MM-ddThh:mm");

	var _RummagerName = self.teacherlist.options[self.teacherlist.selectedIndex].text,
		_RummagerId = parseInt(self.teacherlist.value),
		_CheckDate = self.checktime.value,
		_ClassInfoID = parseInt(self.classlist.value),
		_InterviewPersonCount = parseInt(self.InterviewPersonCount.value),
		_InterviewTable = parseInt(self.InterviewTable.value),
		_ParentOpinion = self.ParentOpinion.value,
		_Implementation = self.Implementation.value,
		_HomeInterviewCheckId = 0;
		if(editdata){
			_HomeInterviewCheckId =editdata.HomeInterviewCheckId;
		}
	//理论上讲 创建时间与检查时间都应该是首次创建该项的时间修改时间保持当前时间状态 

	return {
		"HomeInterviewCheckId": _HomeInterviewCheckId,
		"CheckDate": _CheckDate,
		"RummagerId": _RummagerId,
		"RummagerName": _RummagerName,
		"ClassInfoID": _ClassInfoID,
		"InterviewPersonCount": _InterviewPersonCount,
		"InterviewTable": _InterviewTable,
		"ParentOpinion": _ParentOpinion,
		"Implementation": _Implementation,
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
		if(!self.InterviewPersonCount.value||!self.InterviewTable.value){
		mui.alert("红  *  项不能为空", "提示");
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
	var _id = _sendData.HomeInterviewCheckId
	_sendData = (JSON.stringify(_sendData))
	console.log(_sendData)
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(_sendurl, {
		type: 'post',
		dataType: 'json',
		data: {
			jsonStr: _sendData,
			id: _id
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
			mui.alert('提交失败！', '提示');
		}
	});
};

///////edit
P_type.initEdit = function() {
	this.ajaxGetEditMes();
};
//获取上一次的修改的信息
P_type.ajaxGetEditMes = function() {
	var self = this;
	//	self.key_5_3_id = 1 //临时处理
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
				self.addTeacherList(self.datateacherlist, data.RerurnValue.RummagerId);
				self.setCheckDate(data.RerurnValue.CheckDate)
				self.addClassList(self.dataclasslist, data.RerurnValue.ClassInfoID)
				self.addPreHomeInterviewData(data.RerurnValue);
				self.editMes = data.RerurnValue;
			}
		},
		error: function() {
			self.wating.close();
			mui.alert('请求超时，请检查网络', '提示');
		}
	});
};