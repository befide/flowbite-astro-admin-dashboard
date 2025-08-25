"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genders = void 0;
var csv42_1 = require("csv42");
var fs_1 = require("fs");
var path_1 = require("path");
var yaml_1 = require("yaml");
exports.genders = ["female", "male", "nonbinary"];
var careerLevels = [
    "professor",
    "seniorResearcher",
    "postDoc",
    "phdStudent",
    "masterStudent",
    "bachelorStudent",
];
var disciplinaryProfessions = ["physicist", "engineer", "other"];
var peopleCountDiscriminators = __spreadArray(__spreadArray(__spreadArray([], careerLevels, true), disciplinaryProfessions, true), exports.genders, true);
var __dirname = import.meta.dirname;
function slug(d) {
    return d
        .toLowerCase()
        .replaceAll("ä", "ae")
        .replaceAll("ö", "oe")
        .replaceAll("ü", "ue")
        .replaceAll(":", "!")
        .replaceAll("/", "__")
        .replaceAll(" ", "-")
        .trim();
}
function stringToArray(d) {
    if (d === void 0) { d = ""; }
    return d ? d.split(/\s?,\s?/).filter(function (d) { return !!d; }) : [];
}
function doTable(collectionKey, tableId, idMapper, mapper, postprocess) {
    return __awaiter(this, void 0, void 0, function () {
        var outputFolder, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    outputFolder = path_1.default.join(__dirname, "../src/content/domain/", collectionKey);
                    fs_1.default.rmSync(outputFolder, { recursive: true, force: true });
                    fs_1.default.mkdir(outputFolder, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log("Directory created successfully!");
                    });
                    return [4 /*yield*/, fetch("https://befide.getgrist.com/api/docs/vGtqDxisUdjkKYGmpzAkDj/download/csv?tableId=" +
                            tableId, {
                            headers: {
                                accept: "text/csv",
                                Authorization: "Bearer 839145cf5a7092364d1df58b0908952403ad9657",
                            },
                        })
                            .then(function (response) { return response.text(); })
                            .then(function (data) { return (0, csv42_1.csv2json)(data, { nested: true }); })
                            .catch(function (error) { return console.error("Error:", error); })];
                case 1:
                    data = _a.sent();
                    if (postprocess)
                        postprocess(data);
                    data.forEach(function (d) {
                        var id = idMapper(d);
                        var filePath = path_1.default.join(outputFolder, id + ".mdx");
                        var result = __assign({ slug: id }, mapper(d));
                        var markdown = "---\n" + yaml_1.default.stringify(result) + "---\n";
                        console.log("writing file: " + filePath);
                        fs_1.default.writeFileSync(filePath, markdown);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
var courseIdGenerator = function (_a) {
    var university__organizationsId = _a.university__organizationsId, title = _a.title;
    return slug(university__organizationsId + "/" + title.de);
};
var doCourses = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, doTable("courses", "Courses", courseIdGenerator, function (d) { return ({
                    id: courseIdGenerator(d),
                    teachingEvent__taxonomyId: d.teachingEvent__taxonomyId,
                    university__organizationsId: d.university__organizationsId,
                    studyLevels__taxonomyId: stringToArray(d.studyLevels__taxonomyId),
                    weeklySemesterHours: d.weeklySemesterHours,
                    semesters: stringToArray(d.semesters),
                    title: d.title,
                    objectives: d.objectives,
                    contents: d.contents,
                    languages: stringToArray(d.languages),
                    partOfProgrammesOfStudy: stringToArray(d.partOfProgrammesOfStudy),
                    links: d.links,
                    review: d.review,
                }); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var doTaxonomy = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, doTable("taxonomy-items", "Taxonomy_items", function (d) { return slug(d.id); }, function (d) { return ({
                    slug: d.id,
                    taxonomyURI: d.taxonomyURI,
                    id: d.id,
                    parent__id: !d.parent__id ? null : d.id.split("/").slice(0, -1).join("/"),
                    term: d.term,
                    definition: d.definition,
                    abbreviations: {
                        en: stringToArray(d.abbreviations.en),
                        de: stringToArray(d.abbreviations.de),
                    },
                    synonyms: {
                        en: stringToArray(d.synonyms.en),
                        de: stringToArray(d.synonyms.de),
                    },
                    iris: stringToArray(d.iris),
                    review: d.review,
                }); })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var doOrganizations = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, doTable("organizations", "Organizations", function (_a) {
                    var id = _a.id;
                    return slug(id);
                }, function (d) { return ({
                    slug: d.id,
                    id: d.id,
                    parent__id: d.parent__id,
                    topLevel__id: d.topLevel__id,
                    isPartOfCommunity: d.isPartOfCommunity,
                    instanceOfs__taxonomyId: stringToArray(d.instanceOfs__taxonomyId),
                    befideOrganizationCategories: stringToArray(d.befideOrganizationCategories),
                    label: d.label,
                    description: d.description,
                    head: d.head,
                    headLiteral: d.headLiteral,
                    location: d.location,
                    links: d.links,
                    uniquePeopleCount: d.uniquePeopleCount,
                    uniquePeopleCountSum: d.uniquePeopleCountSum,
                    uniquePeopleCountRecursiveSum: d.uniquePeopleCountRecursiveSum,
                    review: d.review,
                }); }, function (data) {
                    var communityOrganizations = data.filter(function (d) {
                        return d.isPartOfCommunity &&
                            d.befideOrganizationCategories.indexOf("committee") !== 0;
                    });
                    var roots = getRoots(communityOrganizations);
                    var rolledUpNode = rollupUniquePeopleCountSum(roots[0]);
                    console.log(rolledUpNode);
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var doFacilities = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, doTable("facilities", "Facilities", function (_a) {
                    var id = _a.id;
                    return slug(id);
                }, function (d) {
                    var _a, _b;
                    return ({
                        id: d.id,
                        slug: d.id,
                        instanceOf__taxonomyId: d.instanceOf__taxonomyId,
                        partOf__id: d.partOf__id,
                        host__organizationsId: d.host__organizationsId,
                        successorOf__id: d.successorOf__id,
                        parent__id: d.partOf__id || d.successorOf__id || null,
                        isUserFacility: d.isUserFacility,
                        isBMBF_FIS: d.isBMBF_FIS,
                        label: d.label,
                        tagLine: d.tagLine,
                        definition: d.definition,
                        primaryApplications__taxonomyId: stringToArray(d.primaryApplications__taxonomyId),
                        secondaryApplications__taxonomyId: stringToArray(d.secondaryApplications__taxonomyId),
                        lifeCycle: d.lifeCycle,
                        parameters: __assign(__assign({}, d.parameters), { primaryBeamParticles: stringToArray((_a = d.parameters) === null || _a === void 0 ? void 0 : _a.primaryBeamParticles), secondaryBeamParticles: stringToArray((_b = d.parameters) === null || _b === void 0 ? void 0 : _b.secondaryBeamParticles) }),
                        links: d.links,
                        references: stringToArray(d.references),
                        review: d.review,
                    });
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
function getValue(obj, path) {
    var pathParts = path.split(".");
    for (var i = 0; i < pathParts.length; i++) {
        if (pathParts[i] in obj)
            obj = obj[pathParts[i]];
        else
            return;
    }
    return obj;
}
function rollupUniquePeopleCountSum(node) {
    if (node.children.length === 0) {
        node.data.uniquePeopleCountRecursiveSum = __assign({ total: node.data.uniquePeopleCountSum.total }, Object.fromEntries(peopleCountDiscriminators.map(function (d) { return [
            d,
            getValue(node.data.uniquePeopleCountSum, d),
        ]; })));
    }
    else {
        node.children.forEach(function (child) { return rollupUniquePeopleCountSum(child); });
        node.data.uniquePeopleCountRecursiveSum = __assign({ total: node.children.reduce(function (sum, child) {
                return sum + getValue(child.data.uniquePeopleCountRecursiveSum, "total");
            }, getValue(node.data.uniquePeopleCountSum, "total")) }, Object.fromEntries(peopleCountDiscriminators.map(function (d) { return [
            d,
            node.children.reduce(function (sum, child) { return sum + getValue(child.data.uniquePeopleCountRecursiveSum, d); }, getValue(node.data.uniquePeopleCountSum, d)),
        ]; })));
    }
    return node;
}
await doOrganizations();
await doTaxonomy();
await doFacilities();
await doCourses();
