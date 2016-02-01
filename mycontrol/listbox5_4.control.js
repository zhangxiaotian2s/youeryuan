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
	this.createurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=AddKMHomeInterviewCheck';//&jsonStr=''  
	this.updateurl = ' http://115.28.141.223:89/WebServices/KMService.ashx?Option=UpdateKMHomeInterviewCheck'; //&jsonStr=''&id=
	this.editmesurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMPrepareLessonsCheckById&id=';
	this.classlisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetClassListByOrg&Id=' //Id=33

	this.userMes = JSON.parse(plus.storage.getItem('userMes'));
	this.kgid = this.userMes.KgId;
	this.userName = this.userMes.Name;
	this.userId = this.userMes.UserId;
	this.DataDictionaryType = "KitchenCheckType";
	this.datateacherlist = '';
	this.dataclasslist = '';
	this.PrepareLessonsCheckId = parseInt(plus.storage.getItem('PrepareLessonsCheckId'));
	this.teacherlist = document.getElementById('teacherslist');
	this.datateacherlist = JSON.parse(plus.storage.getItem('teacherlist'))
	this.dataclasslist = JSON.parse(plus.storage.getItem('classlist'))
	this.checktable = document.getElementById('check_Table');
	this.senbtn = document.getElementById('sendbtn');
	this.addbtn = document.getElementById('add_one');
	this.checkbox = document.getElementById('homeInterviewtab')
	this.wating = '';
}
homeInterview.prototype.initNew = function() {
	this.ajaxGetTeacherList();
	this.ajaxGetClassList();
};
//页面打开时设置被选中的按钮的颜色 
homeInterview.prototype.initRadioParentBk = function() {
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
homeInterview.prototype.ajaxGetTeacherList = function(editid) { //获取到的上次的修改人的id
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
				self.addTeacherList(data.RerurnValue, editid)
			}
		},
		error: function() {
			self.wating.close()
			mui.alert("获取检查人失败，请检查网络", '提示')
		}
	});
};
homeInterview.prototype.addTeacherList = function(data, selectedvalue) {
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
homeInterview.prototype.ajaxGetClassList = function() {
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
			}
		},
		error: function() {
			self.wating.close();
		}
	})
}


//添加上次新建检查结果
homeInterview.prototype.addPreClassCheck = function(dataclass, datateacher, editdata) {
	var self = this
	var _data = editdata.KMLessonsCheckDetailList;
	for (j = 0; j < _data.length; j++) {
		var _li = document.createElement('li');
		_li.setAttribute('class', 'mui-table-view-cell')
		var _html = "";
		_html += '<div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red">删除</a></div><div class="mui-slider-handle"><table width="100%" class="tablestyle1">'
		_html += '<tr>';
		_html += '<td width="13%"><select class="select_ClassInfoID">';
		for (i = 0; i < dataclass.length; i++) {
			if (dataclass[i].ClassInfoID == _data[j].ClassInfoID) {
				_html += '<option value="' + dataclass[i].ClassInfoID + '"  selected="selected"   >' + dataclass[i].ClassName + '</option>';
			} else {
				_html += '<option value="' + dataclass[i].ClassInfoID + '"   >' + dataclass[i].ClassName + '</option>';
			}
		}
		_html += '</select></td>';
		_html += '<td width="13%"><select class="select_LessonsTeacher" >';
		for (i = 0; i < datateacher.length; i++) {
			if (datateacher[i].WorkerExtensionId == _data[j].TeacherId) {
				_html += '<option value="' + datateacher[i].WorkerExtensionId + '"  selected="selected" >' + datateacher[i].Name + '</option>';
			} else {
				_html += '<option value="' + datateacher[i].WorkerExtensionId + '">' + datateacher[i].Name + '</option>';
			}
		}
		_html += '</select></td>';
		_html += '	<td width="13%" class="select_IsPost"><select>';
		if (_data[j].IsPost == 1) {
			_html += '<option value="1" selected="selected" >是</option>';
			_html += '<option value="0">否</option>';
		} else {
			_html += '<option value="1">是</option>';
			_html += '<option value="0" selected="selected" >否</option>';
		}
		_html += '</select></td>';
		_html += '<td width="13%"><input type="text" class="mui-input input_Emphases" value="' + _data[j].Emphases + '"></td>';
		_html += '<td width="22%"><input type="text" class="mui-input jian input_HalfDayPlan" value="' + _data[j].HalfDayPlan + '"></td>';
		_html += '<td width="13%"><input type="text" class="mui-input jian input_Reflections" value="' + _data[j].Reflections + '"></td>';
		_html += '<td width="13%"><input type="text" class="mui-input jian input_GeneralComment" value="' + _data[j].GeneralComment + '"></td>';
		_html += '</tr>';
		_html += '</table></div>'
		_li.innerHTML = _html
		self.checkbox.appendChild(_li)
	}
}




//添加检查项进入dome
homeInterview.prototype.insertCheckHtmlDome = function(dataclass) { //editdata获取编辑的返回data
     
	this.checkbox.appendChild(_li)
};
//动态获取备课检查记录提交的数值
homeInterview.prototype.geSendArrValue = function(editdata) {
	var self = this;
	self.ClassInfoID = document.querySelectorAll('.select_ClassInfoID');
	self.LessonsTeacher = document.querySelectorAll('.select_LessonsTeacher');
	self.IsPost = document.querySelectorAll('.select_IsPost');
	self.Emphases = document.querySelectorAll('.input_Emphases');
	self.HalfDayPlan = document.querySelectorAll('.input_HalfDayPlan');
	self.Reflections = document.querySelectorAll('.input_Reflections');
	self.GeneralComment = document.querySelectorAll('.input_GeneralComment');
	var _length = self.ClassInfoID.length;
	var arrClassInfoID = getArrData(self.ClassInfoID);
	var arrTeacherId = getArrData(self.LessonsTeacher);
	var arrLessonsTeacher = getArrTeachers(self.LessonsTeacher);
	var arrIsPost = getArrData(self.IsPost);
	var arrEmphases = getArrData(self.Emphases);
	var arrHalfDayPlan = getArrData(self.HalfDayPlan);
	var arrReflections = getArrData(self.Reflections);
	var arrGeneralComment = getArrData(self.GeneralComment);
	var KMLessonsCheckDetailList = [];
	var _time = new Date();
	var sendjsonstr = '';
	var modifytime = createtime;
	var creator = self.userName,
		creatorid = self.userId,
		createtime = _time.Format("yyyy-MM-ddThh:mm:ss"),
		examinator = self.teacherlist.options[self.teacherlist.selectedIndex].text,
		examinatorId = self.teacherlist.value,
		modifier = "",
		modifierid = 0,
		modifytime = createtime,
		prepareLessonsCheckId = 0;
	if (editdata) {
		var creator = editdata.Creator,
			creatorid = editdata.CreatorId,
			createtime = editdata.CheckDate,
			examinator = editdata.ExaminatorName,
			examinatorId = editdata.ExaminatorId,
			modifier = self.teacherlist.options[self.teacherlist.selectedIndex].text,
			modifierid = self.teacherlist.value,
			modifytime = _time.Format("yyyy-MM-ddThh:mm:ss");
		prepareLessonsCheckId = self.PrepareLessonsCheckId;
	}
	var creatMES, examinatorMes, modifyMes;

	function getArrData(data) {
		var _arr = [];
		for (i = 0; i < _length; i++) {
			_arr.push(data[i].value);
		}
		return _arr;
	};

	function getArrTeachers(data) {
		var _arr = [];
		for (i = 0; i < _length; i++) {
			_arr.push(data[i].options[data[i].selectedIndex].text)
		}
		return _arr
	}


	for (i = 0; i < _length; i++) {
		var _value = {
			"LessonsCheckDetailId": 0,
			"PrepareLessonsCheckId": prepareLessonsCheckId,
			"ClassInfoID": arrClassInfoID[i],
			"TeacherId": arrTeacherId[i],
			"LessonsTeacher": arrLessonsTeacher[i],
			"IsPost": arrIsPost[i],
			"Emphases": arrEmphases[i],
			"HalfDayPlan": arrHalfDayPlan[i],
			"Reflections": arrReflections[i],
			"GeneralComment": arrGeneralComment[i]
		}
		KMLessonsCheckDetailList.push(_value)
	}

	KMLessonsCheckDetailList = JSON.stringify(KMLessonsCheckDetailList);
	creatMES = '"Creator":"' + creator + '","CreatorId":' + creatorid + ',"CreateDate":"' + createtime + '",';
	examinatorMes = '"ExaminatorName":"' + examinator + '","ExaminatorId":' + examinatorId + ',"CheckDate":"' + createtime + '",';
	modifyMes = '"Modifier":"' + modifier + '","ModifyId":' + modifierid + ',"ModifyDate":"' + modifytime + '"}';
	sendjsonstr = '{"KMLessonsCheckDetailList":' + KMLessonsCheckDetailList + ',"PrepareLessonsCheckId":' + prepareLessonsCheckId + ',"OrganizationId":' + self.kgid + ',' + sendjsonstr + creatMES + examinatorMes + modifyMes;
	return sendjsonstr
}


//检查提交事件
homeInterview.prototype.sendBtnTap = function(edit) {
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
homeInterview.prototype.ajaxSendCheckMES = function(editMES) {
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
	console.log(_sendData)
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(_sendurl, {
		type: 'post',
		dataType: 'json',
		data: {
			jsonStr: _sendData,
			id: self.PrepareLessonsCheckId
		},
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				plus.storage.setItem('PrepareLessonsCheckId', (data.RerurnValue).toString());
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
homeInterview.prototype.initEdit = function() {
	this.ajaxGetTeacherList();
	this.ajaxGetClassList();
	this.ajaxGetEditMes();
	this.addBtnFn()
};
//获取上一次的修改的信息
homeInterview.prototype.ajaxGetEditMes = function() {
	var self = this;
	if (!self.PrepareLessonsCheckId) {
		mui.alert('请新建一项才能编辑', '提示', function() {
			mui.back();
		});
		return;
	}
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(self.editmesurl + self.PrepareLessonsCheckId, {
		type: 'get',
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				self.ajaxGetTeacherList(data.RerurnValue.ExaminatorId);
				self.addPreClassCheck(self.dataclasslist, self.datateacherlist, data.RerurnValue);
				self.editMes = data.RerurnValue;
			}
		},
		error: function() {
			self.wating.close();
			mui.alert('请求超时，请检查网络', '提示');
		}
	});
};