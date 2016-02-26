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

//全托班管理
function systemPage() {
	this.teachersurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetWorkerExtension&'; //KgId=33&modifyTime=2015-01-01
	this.createurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=AddKMComprehensiveRecord'; //&jsonStr=''  
	this.updateurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=UpdateKMComprehensiveRecord'; //&jsonStr=''&id=
	this.editmesurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMComprehensiveRecordById&id=';
	this.classlisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetClassListByOrg&Id=' //Id=33

	this.userMes = JSON.parse(plus.storage.getItem('userMes'));
	this.kgid = this.userMes.KgId;
	this.userName = this.userMes.Name;
	this.userId = this.userMes.UserId;
	this.DataDictionaryType = "KitchenCheckType";
	this.key_2__5_id = parseInt(plus.storage.getItem('key_2__5_id')) || 0;
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

	this.FirstCheckTime = document.getElementById('FirstCheckTime');
	this.FirstCheckRecord = document.getElementById('FirstCheckRecord');
	this.SecondCheckTime = document.getElementById('SecondCheckTime');
	this.SecondCheckRecord = document.getElementById('SecondCheckRecord');
	this.ThirdCheckTime = document.getElementById('ThirdCheckTime');
	this.ThirdCheckRecord = document.getElementById('ThirdCheckRecord');
	this.FourthCheckTime = document.getElementById('FourthCheckTime');
	this.FourthCheckRecord = document.getElementById('FourthCheckRecord');
	this.Situation = document.getElementById('Situation');
	this.Manage = document.getElementById('Manage');
	this.Remark = document.getElementById('Remark');

}
var P_type = systemPage.prototype;
P_type.initNew = function() {
	this.setCheckDate(this.checktime)
	this.setCheckDate(this.FirstCheckTime)
	this.setCheckDate(this.SecondCheckTime)
	this.setCheckDate(this.ThirdCheckTime)
	this.setCheckDate(this.FourthCheckTime)
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

				}
			}
		},
		error: function() {
			self.wating.close()
			mui.alert("获取检查人失败，请检查网络", '提示')
		}
	});
};
//设置检查的默认时间
P_type.setCheckDate = function(timeelement, checkdate) {
	if (checkdate) {
		timeelement.value = checkdate
		timeelement.setAttribute('readonly', 'readonly')
		return
	}
	var nowtime = new Date()
	nowtime = nowtime.Format("yyyy-MM-ddThh:mm")
	timeelement.value = nowtime
};

P_type.addPreKMComprehensiveRecordData = function(data) {
	var self = this;
	self.checktime.value = data.CheckDate
	self.FirstCheckTime.value = data.FirstCheckTime;
	self.FirstCheckRecord.value = data.FirstCheckRecord;
	self.SecondCheckTime.value = data.SecondCheckTime;
	self.SecondCheckRecord.value = data.SecondCheckRecord;
	self.ThirdCheckTime.value = data.ThirdCheckTime;
	self.ThirdCheckRecord.value = data.ThirdCheckRecord;
	self.FourthCheckTime.value = data.FourthCheckTime;
	self.FourthCheckRecord.value = data.FourthCheckRecord;
	self.Situation.innerText = data.Situation;
	self.Manage.innerText = data.Manage;
	self.Remark.innerText = data.Remark;

}









//动态获取备课检查记录提交的数值
P_type.geSendArrValue = function(editdata) {
	var self = this;
	var _nowtime = new Date();
	_nowtime = _nowtime.Format("yyyy-MM-ddThh:mm");
	var _FirstCheckTime = self.FirstCheckTime.value,
		_FirstCheckRecord = self.FirstCheckRecord.value,
		_SecondCheckTime = self.SecondCheckTime.value,
		_SecondCheckRecord = self.SecondCheckRecord.value,
		_ThirdCheckTime = self.ThirdCheckTime.value,
		_ThirdCheckRecord = self.ThirdCheckRecord.value,
		_FourthCheckTime = self.FourthCheckTime.value,
		_FourthCheckRecord = self.FourthCheckRecord.value,
		_Situation = self.Situation.value,
		_Manage = self.Manage.value,
		_Remark = self.Remark.value,
		_CreateDate = _nowtime,
		_CheckDate = self.checktime.value,
		_ComprehensiveRecordId = 0;

	if (editdata) {
		_ComprehensiveRecordId = editdata.ComprehensiveRecordId;
		_CreateDate = editdata.CreateDate;
	}
	//理论上讲 创建时间与检查时间都应该是首次创建该项的时间修改时间保持当前时间状态 

	return {
		"ComprehensiveRecordId": _ComprehensiveRecordId,
		"CheckDate": _CheckDate,
		"FirstCheckTime": _FirstCheckTime,
		"FirstCheckRecord": _FirstCheckRecord,
		"SecondCheckTime": _SecondCheckTime,
		"SecondCheckRecord": _SecondCheckRecord,
		"ThirdCheckTime": _ThirdCheckTime,
		"ThirdCheckRecord": _ThirdCheckRecord,
		"FourthCheckTime": _FourthCheckTime,
		"FourthCheckRecord": _FourthCheckRecord,
		"Situation": _Situation,
		"Manage": _Manage,
		"Remark": _Remark,
		"State": 1,
		"OrganizationId": self.kgid,
		"CreatorId": self.userId,
		"Creator": self.userName,
		"CreateDate": _CreateDate,
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
	//	var examinatorId = self.teacherlist.value;
	//	if (!examinatorId) {
	//		mui.alert("请选择检查人", "提示");
	//		return;
	//	}
	var _sendData, _sendurl;
	if (editMES) {
		_sendurl = self.updateurl;
		_sendData = self.geSendArrValue(editMES);
	} else {
		_sendurl = self.createurl;
		_sendData = self.geSendArrValue();
	}
	var _id = _sendData.ComprehensiveRecordId
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
					plus.storage.setItem('key_2__5_id', (data.RerurnValue).toString());
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
	if (!self.key_2__5_id) {
		mui.alert('请新建一项才能编辑', '提示', function() {
			mui.back();
		});
		return;
	}

	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(self.editmesurl + self.key_2__5_id, {
		type: 'get',
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				console.log(JSON.stringify(data.RerurnValue))
				self.addPreKMComprehensiveRecordData(data.RerurnValue);
				self.editMes = data.RerurnValue;
			}
		},
		error: function() {
			self.wating.close();
			mui.alert('请求超时，请检查网络', '提示');
		}
	});
};