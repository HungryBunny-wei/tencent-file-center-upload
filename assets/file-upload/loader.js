var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "flyUpload/polyfills", "flyUpload/main"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("flyUpload/polyfills");
    require("flyUpload/main");
    var HttpEventType;
    (function (HttpEventType) {
        HttpEventType[HttpEventType["Sent"] = 0] = "Sent";
        HttpEventType[HttpEventType["UploadProgress"] = 1] = "UploadProgress";
        HttpEventType[HttpEventType["ResponseHeader"] = 2] = "ResponseHeader";
        HttpEventType[HttpEventType["DownloadProgress"] = 3] = "DownloadProgress";
        HttpEventType[HttpEventType["Response"] = 4] = "Response";
        HttpEventType[HttpEventType["User"] = 5] = "User";
    })(HttpEventType = exports.HttpEventType || (exports.HttpEventType = {}));
    var uploadService = window.flyUploadService;
    var style = document.createElement('link');
    style.id = '_flyuploadcss';
    style.href = require.toUrl('flyUpload/styles.css');
    style.rel = 'stylesheet';
    document.head.appendChild(style);
    function config(options) {
        if (!options) {
            throw new Error('options is null');
        }
        if (window.flyUploadService.config) {
            Object.assign(window.flyUploadService.config, options);
        }
        else {
            throw new Error('not find flyUploadService');
        }
    }
    exports.config = config;
    function create(options) {
        var _this = this;
        var target = typeof options.selector === 'string' ? document.querySelector(options.selector) : options.selector;
        if (!target) {
            throw new Error(options.selector + " Element not found");
        }
        var upload = document.createElement('fly-upload');
        var excludeKeys = ['selector', 'params', 'model', 'modelChange', 'nzCustomRequest', 'withCredentials', 'nzChange'];
        var eventKeys = ['nzChange', 'nzFileListChange'];
        Object.keys(options).forEach(function (key) {
            if (excludeKeys.includes(key)) {
                return;
            }
            if (typeof options[key] === 'undefined') {
                return;
            }
            if (eventKeys.includes(key)) {
                upload.addEventListener(key, function ($event) {
                    options[key]($event.detail);
                });
            }
            else {
                upload[key] = options[key];
            }
        });
        if (typeof options.nzCustomRequest === 'undefined') {
            options.nzCustomRequest = function (item) {
                return uploadService.upload(item.file[0], {
                    params: options.params,
                    reportProgress: true,
                    withCredentials: options.withCredentials,
                    headers: item.headers,
                }).subscribe(function (result) {
                    if (result.type === HttpEventType.UploadProgress) {
                        if (result.total > 0) {
                            result.percent = (result.loaded / result.total) * 100;
                        }
                        item.onProgress(result, item.file);
                    }
                    else if (result.type === HttpEventType.Response) {
                        item.onSuccess(result.body, item.file, result);
                    }
                }, function (err) {
                    item.onError(err, item.file);
                });
            };
        }
        upload.nzCustomRequest = options.nzCustomRequest;
        upload.addEventListener('nzChange', function ($event) {
            var changeValue = $event.detail;
            if (options.nzChange) {
                options.nzChange(changeValue);
            }
            if (changeValue.type === 'success' || changeValue.type === 'removed') {
                var fileDone = changeValue.fileList.filter(function (file) {
                    return file.status === 'done';
                });
                options.modelChange(fileDone.map(function (file) {
                    if (file.id) {
                        return file.id;
                    }
                    else {
                        console.error(file);
                        throw new Error('上传没有id');
                    }
                }).join('||'));
            }
        });
        if (options.model) {
            queryFileList(options.model).then(function (files) { return __awaiter(_this, void 0, void 0, function () {
                var nzFileList, isImageReg, _i, files_1, fileDetail, file, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            nzFileList = [];
                            isImageReg = /(.image$)|(.webp$)|(.png$)|(.svg$)|(.gif$)|(.jpg$)|(.jpeg$)|(.bmp$)|(.dpg$)|(.ico$)|(.jfif$)/g;
                            _i = 0, files_1 = files;
                            _b.label = 1;
                        case 1:
                            if (!(_i < files_1.length)) return [3, 5];
                            fileDetail = files_1[_i];
                            file = {
                                type: isImageReg.test(fileDetail.name) || fileDetail.contentType.includes('image') ? 'image' : 'other',
                                uid: fileDetail.id,
                                name: fileDetail.name,
                                status: 'done',
                                url: fileDetail.name,
                                id: fileDetail.id
                            };
                            if (!(file.type === 'image')) return [3, 3];
                            _a = file;
                            return [4, uploadService.downloadUrl(file.id, { accessType: 'auth' }).toPromise()];
                        case 2:
                            _a.thumbUrl = _b.sent();
                            _b.label = 3;
                        case 3:
                            nzFileList.push(file);
                            _b.label = 4;
                        case 4:
                            _i++;
                            return [3, 1];
                        case 5:
                            upload.nzFileList = nzFileList;
                            return [2];
                    }
                });
            }); });
        }
        var targetParent = target.parentElement;
        var nextSibling = target.nextSibling;
        upload.appendChild(target);
        if (nextSibling) {
            targetParent.insertBefore(upload, nextSibling);
        }
        else {
            targetParent.appendChild(upload);
        }
        return upload;
    }
    exports.create = create;
    function queryFileList(model) {
        var _this = this;
        var result = [];
        if (!model) {
            return Promise.resolve(result);
        }
        var ids = model.split('||').map(function (id) { return id.trim(); }).filter(function (id) { return id; });
        if (ids.length < 1) {
            return Promise.resolve(result);
        }
        if (ids.length === this.fileList.length) {
            var isExist = ids.filter(function (id) {
                return _this.fileList.find(function (file) {
                    return file.id === id;
                });
            });
            if (isExist.length === ids.length) {
                return;
            }
        }
        return uploadService.queryFile(ids).toPromise();
    }
    exports.queryFileList = queryFileList;
});
//# sourceMappingURL=loader.js.map