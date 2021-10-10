export function makeRelationshipSet() {
  return {
    dependencies: {},
    conflicts: {},
  };
}

export function addDep(a, b, s) {
  var dependenciesA = s.dependencies[a];
  s.dependencies = { ...s.dependencies, [a]: [...(dependenciesA || []), b] };
  return s;
}

export function addConflict(a, b, s) {
  var conflictsA = s.conflicts[a];
  s.conflicts = { ...s.conflicts, [a]: [...(conflictsA || []), b] };
  return s;
}

// This doesn't work because its not recursive
export function isCoherent(s) {
  let setIsCoherent = true;
  Object.entries(s.conflicts).map(([key, conflictSet]) => {
    if (
      s.dependencies[key] &&
      s.dependencies[key]
        .map((dep) => {
          const topLevel =  conflictSet.includes(dep);

          const immediateChild = s.dependencies[dep] ? s.dependencies[dep].map(childDep=>{
            return conflictSet.includes(childDep)
          }).includes(true) : false

          return topLevel || immediateChild
        })
        .includes(true)
    ) {
      setIsCoherent = false;
    } else {
      setIsCoherent = true;
    }
  });
  return setIsCoherent;
}

// This should be recursive
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
  let family = [];

  // if the first key appears anywhere else then it is the family
  // this doesn't work I'm just leaving it here anyway like a school exam showing my work
  S.dependencies[key].forEach((depkey) => {
    if (S.dependencies[depkey]) {
      family.push(depkey);
      findFamilies(S, depkey);
    } else {
      return;
    }
  });

  return family;
}
