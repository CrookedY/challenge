"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addConflict = addConflict;
exports.addDep = addDep;
exports.isCoherent = isCoherent;
exports.makeRelationshipSet = makeRelationshipSet;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function makeRelationshipSet() {
  return {
    dependencies: {},
    conflicts: {}
  };
}

function addDep(a, b, s) {
  var dependenciesA = s.dependencies[a];
  s.dependencies = _objectSpread(_objectSpread({}, s.dependencies), {}, {
    [a]: [...(dependenciesA || []), b]
  });
  return s;
}

function addConflict(a, b, s) {
  var conflictsA = s.conflicts[a];
  s.conflicts = _objectSpread(_objectSpread({}, s.conflicts), {}, {
    [a]: [...(conflictsA || []), b]
  });
  return s;
} // This doesn't work because its not recursive


function isCoherent(s) {
  let setIsCoherent = true;
  Object.entries(s.conflicts).map(([key, conflictSet]) => {
    if (s.dependencies[key] && s.dependencies[key].map(dep => {
      const topLevel = conflictSet.includes(dep);
      const immediateChild = s.dependencies[dep] ? s.dependencies[dep].map(childDep => {
        return conflictSet.includes(childDep);
      }).includes(true) : false;
      return topLevel || immediateChild;
    }).includes(true)) {
      setIsCoherent = false;
    } else {
      setIsCoherent = true;
    }
  });
  return setIsCoherent;
} // This should be recursive
// function checkChildren(S, key, blocker) {
//   let family = [];
//   const dependencies = { ...S.dependencies };
//   if (
//     Object.keys(dependencies).map((deps) => dependencies[deps].includes(key))
//   ) {
//     family.push(key);
//     checkChildren(S, key);
//   } else {
//     return family;
//   }
// }
// find all children


function findFamilies(S, key) {
  let family = []; // if the first key appears anywhere else then it is the family
  // this doesn't work I'm just leaving it here anyway like a school exam showing my work

  S.dependencies[key].forEach(depkey => {
    if (S.dependencies[depkey]) {
      family.push(depkey);
      findFamilies(S, depkey);
    } else {
      return;
    }
  });
  return family;
}