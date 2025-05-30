import { Classroom } from "./classroom"

let classrooms: Classroom[] = (
  JSON.parse(localStorage.getItem("classrooms") || "null") ?? [
    { id: 1, name: "כיתה א" },
    { id: 2, name: "כיתה ב" },
    { id: 3, name: "כיתה ג" },
  ]
).sort((a: Classroom, b: Classroom) => a.name.localeCompare(b.name, "he"))

const listeners: ((classrooms: Classroom[]) => void)[] = []

export function getClassrooms(): Classroom[] {
  return [...classrooms]
}

export function subscribeToClassrooms(listener: (classrooms: Classroom[]) => void): () => void {
  listeners.push(listener)
  listener(getClassrooms())
  return () => {
    const index = listeners.indexOf(listener)
    if (index !== -1) listeners.splice(index, 1)
  }
}

function saveToStorage() {
  localStorage.setItem("classrooms", JSON.stringify(classrooms))
}

export function addClassroom(classroom: Classroom) {
  const exists = classrooms.some((c) => c.name === classroom.name)
  if (exists) {
    alert("כיתה בשם זה כבר קיימת")
    return
  }
  classrooms = [...classrooms, classroom]
  saveToStorage()
  listeners.forEach((l) => l(getClassrooms()))
}

export function deleteClassroom(id: number) {
  classrooms = classrooms.filter((c) => c.id !== id).sort((a, b) => a.name.localeCompare(b.name, "he"))
  saveToStorage()
  listeners.forEach((l) => l(getClassrooms()))
}

export function updateClassroom(updated: Classroom) {
  const exists = classrooms.some((c) => c.name === updated.name)
  if (exists) {
    alert("כיתה בשם זה כבר קיימת")
    return
  }
  classrooms = classrooms.map((c) => (c.id === updated.id ? updated : c))
  saveToStorage()
  listeners.forEach((l) => l(getClassrooms()))
}
