//LessonsCheck
mui.init();
(function($) {
	var btnArray = ['确认', '取消'];
	$('#OA_task_1').on('tap', '.mui-btn', function(event) {
		var elem = this;
		var li = elem.parentNode.parentNode;
		mui.confirm('确认删除该条记录？', 'Hello MUI', btnArray, function(e) {
			if (e.index == 0) {
				li.parentNode.removeChild(li);
			} else {
				setTimeout(function() {
					$.swipeoutClose(li);
				}, 0);
			}
		});
	});
})(mui);
mui.plusReady(function() {
	var slefwebiew = plus.webview.currentWebview();
	var action = slefwebiew.action;
	var lesseoncheck = new lesseonCheck();
	if (action == 'new') {
		lesseoncheck.initNew();
		lesseoncheck.sendBtnTap();
	} else if (action == 'edit') {
		lesseoncheck.initEdit();
		lesseoncheck.sendBtnTap('edit');
	}
});

//厨房检查
function lesseonCheck() {
	this.teachersurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetWorkerExtension&'; //KgId=33&modifyTime=2015-01-01
	//	this.checklisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKitchenCheckItem&'; //KgId=33&KitchenCheckType=KitchenCheckType
	this.createurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=AddKMPrepareLessonsCheck';
	this.updateurl = ' http://115.28.141.223:89/WebServices/KMService.ashx?Option=UpdateKMPrepareLessonsCheck'; //{jsonstr}&jsonStr=''&&id='
	this.editmesurl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetKMPrepareLessonsCheckById&id=';
	this.classlisturl = 'http://115.28.141.223:89/WebServices/KMService.ashx?Option=GetClassListByOrg&Id=' //Id=33

	this.userMes = JSON.parse(plus.storage.getItem('userMes'));
	this.kgid = this.userMes.KgId;
	this.userName = this.userMes.Name;
	this.userId = this.userMes.UserId;
	this.DataDictionaryType = "KitchenCheckType";
	this.key_2_1_id = parseInt(plus.storage.getItem('key_2_1_id'))||0;
	this.teacherlist = document.getElementById('teacherslist');
	this.datateacherlist = JSON.parse(plus.storage.getItem('teacherlist'))
	this.dataclasslist = JSON.parse(plus.storage.getItem('classlist'))
	this.checktable = document.getElementById('check_Table');
	this.senbtn = document.getElementById('sendbtn');
	this.addbtn = document.getElementById('add_one');
	this.checkbox = document.getElementById('OA_task_1')
	this.wating = '';
}
var P_type=lesseonCheck.prototype;
P_type.initNew = function() {
	this.ajaxGetTeacherList();
	this.ajaxGetClassList();
	this.addTeacherList(this.datateacherlist)
	this.addBtnFn()
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
				//如果不能从本地存储中读取教师列表的情况下
				if (!self.datateacherlist) {
                       self.addTeacherList(data.RerurnValue, editid)
				}
				self.datateacherlist = data.RerurnValue
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
			}
		},
		error: function() {
			self.wating.close();
		}
	})
}

//添加检测项的方法
P_type.addBtnFn = function() {
	var self = this;
	self.addbtn.addEventListener('tap', function() {
		self.addOneClassCheck(self.dataclasslist, self.datateacherlist)
	}, false)
}

//添加上次新建检查结果
P_type.addPreClassCheck = function(dataclass, datateacher, editdata) {
	var self = this
	var _data = editdata.KMLessonsCheckDetailList;
	for (j = 0; j < _data.length; j++) {
		var _li = document.createElement('li');
		_li.setAttribute('class', 'mui-table-view-cell')
		var _html = "";
		_html += '<div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red">删除</a></div><div class="mui-slider-handle"><table width="100%" class="tablestyle1">'
		_html += '<tr>';
		_html += '<td width="15%"><select class="select_ClassInfoID">';
		for (i = 0; i < dataclass.length; i++) {
			if (dataclass[i].ClassInfoID == _data[j].ClassInfoID) {
				_html += '<option value="' + dataclass[i].ClassInfoID + '"  selected="selected"   >' + dataclass[i].ClassName + '</option>';
			} else {
				_html += '<option value="' + dataclass[i].ClassInfoID + '"   >' + dataclass[i].ClassName + '</option>';
			}
		}
		_html += '</select></td>';
		_html += '<td width="15%"><select class="select_LessonsTeacher" >';
		for (i = 0; i < datateacher.length; i++) {
			if (datateacher[i].WorkerExtensionId == _data[j].TeacherId) {
				_html += '<option value="' + datateacher[i].WorkerExtensionId + '"  selected="selected" >' + datateacher[i].Name + '</option>';
			} else {
				_html += '<option value="' + datateacher[i].WorkerExtensionId + '">' + datateacher[i].Name + '</option>';
			}
		}
		_html += '</select></td>';
		_html += '	<td width="10%" class="select_IsPost"><select>';
		if (_data[j].IsPost == 1) {
			_html += '<option value="1" selected="selected" >是</option>';
			_html += '<option value="0">否</option>';
		} else {
			_html += '<option value="1">是</option>';
			_html += '<option value="0" selected="selected" >否</option>';
		}
		_html += '</select></td>';
		_html += '<td width="15%"><input type="text" class="mui-input input_Emphases" value="' + _data[j].Emphases + '"></td>';
		_html += '<td width="15%"><input type="text" class="mui-input jian input_HalfDayPlan" value="' + _data[j].HalfDayPlan + '"></td>';
		_html += '<td width="15%"><input type="text" class="mui-input jian input_Reflections" value="' + _data[j].Reflections + '"></td>';
		_html += '<td width="15%"><input type="text" class="mui-input jian input_GeneralComment" value="' + _data[j].GeneralComment + '"></td>';
		_html += '</tr>';
		_html += '</table></div>'
		_li.innerHTML = _html
		self.checkbox.appendChild(_li)
	}
}




//添加检查项进入dome
P_type.addOneClassCheck = function(dataclass, datateacher, editdata) { //editdata获取编辑的返回data
	var _li = document.createElement('li');
	_li.setAttribute('class', 'mui-table-view-cell')
	var _html = "";
	_html += '<div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red">删除</a></div><div class="mui-slider-handle"><table width="100%" class="tablestyle1">'
	_html += '<tr>';
	_html += '<td width="15%"><select class="select_ClassInfoID" style="text-align: center;">';
	for (i = 0; i < dataclass.length; i++) {
		_html += '<option value="' + dataclass[i].ClassInfoID + '"   >' + dataclass[i].ClassName + '</option>';
	}
	_html += '</select></td>';
	_html += '<td width="15%"><select class="select_LessonsTeacher" >';
	for (i = 0; i < datateacher.length; i++) {
		_html += '<option value="' + datateacher[i].WorkerExtensionId + '">' + datateacher[i].Name + '</option>';
	}
	_html += '</select></td>';
	_html += '	<td width="10%" class="select_IsPost"><select>';
	_html += '<option value="1">是</option>';
	_html += '<option value="0">否</option>';
	_html += '</select></td>';
	_html += '<td width="15%"><input type="text" class="mui-input input_Emphases"></td>';
	_html += '<td width="15%"><input type="text" class="mui-input jian input_HalfDayPlan "></td>';
	_html += '<td width="15%"><input type="text" class="mui-input jian input_Reflections"></td>';
	_html += '<td width="15%"><input type="text" class="mui-input jian input_GeneralComment"></td>';
	_html += '</tr>';
	_html += '</table></div>'
	_li.innerHTML = _html
	this.checkbox.appendChild(_li)
};
//动态获取备课检查记录提交的数值
P_type.geSendArrValue = function(editdata) {
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
		modifier = self.userName,
		modifierid =  self.userId,
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
		prepareLessonsCheckId = self.key_2_1_id;
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
	console.log(_sendData)
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(_sendurl, {
		type: 'post',
		dataType: 'json',
		data: {
			jsonStr: _sendData,
			id: self.key_2_1_id
		},
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				plus.storage.setItem('key_2_1_id', (data.RerurnValue).toString());
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
	this.addBtnFn()
};
//获取上一次的修改的信息
P_type.ajaxGetEditMes = function() {
	var self = this;
	if (!self.key_2_1_id) {
		mui.alert('请新建一项才能编辑', '提示', function() {
			mui.back();
		});
		
		return;
	}
	self.wating = plus.nativeUI.showWaiting();
	mui.ajax(self.editmesurl + self.key_2_1_id, {
		type: 'get',
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			self.wating.close();
			if (data.Success == 10000) {
				self.addTeacherList(self.datateacherlist,data.RerurnValue.ExaminatorId);
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