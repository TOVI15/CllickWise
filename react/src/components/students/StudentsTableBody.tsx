"use client"

import type React from "react"
import { Table, TableBody, TableRow, TableCell, Checkbox, Box, Button, IconButton, Chip } from "@mui/material"
import { Delete, Edit, AccountBox, CheckCircle, PersonAdd } from "@mui/icons-material"
import type { typeStudent } from "../../moduls/Student"
import { Spinner } from "../main/Spiner"

import type { AlertColor } from "@mui/material"
import { Classroom } from "../../moduls/classroom"
import ErrorAlert from "../main/Error-alert"

interface StudentsTableBodyProps {
  loading: boolean
  finalFiltered: typeStudent[]
  selectedIds: number[]
  alertState: { open: boolean; message: string; severity: AlertColor }
  onAlertStateChange: (alertState: { open: boolean; message: string; severity: AlertColor }) => void
  handleSelect: (id: number) => void
  classrooms: Classroom[]
  editingStudentId: number | null
  onEditingStudentIdChange: (id: number | null) => void
  selectedGroup: number
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>, student: typeStudent) => void
  handleRegister: (student: typeStudent) => void
  handleOpenDialog: (student: typeStudent, editMode: boolean) => void
  handleDeleteClick: (id: number) => void
}

const StudentsTableBody: React.FC<StudentsTableBodyProps> = ({
  loading,
  finalFiltered,
  selectedIds,
  alertState,
  onAlertStateChange,
  handleSelect,
  classrooms,
  editingStudentId,
  onEditingStudentIdChange,
  selectedGroup,
  handleChange,
  handleRegister,
  handleOpenDialog,
  handleDeleteClick,
}) => {
  if (loading) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={10} align="center" sx={{ py: 8, border: "none" }}>
              <Spinner />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  if (finalFiltered.length === 0) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={10} align="center" sx={{ py: 8, border: "none" }}>
              <Box
                sx={{
                  color: "#64748b",
                  padding: 4,
                  fontWeight: 500,
                  fontSize: "1.1rem",
                  maxWidth: 400,
                  mx: "auto",
                }}
              >
                אין נתונים להצגה
              </Box>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  return (
    <Table>
      <TableBody>
        {finalFiltered.map((student, index) => (
          <TableRow
            key={student.id}
            hover
            sx={{
              backgroundColor: selectedIds.includes(student.id) ? "#f0f9ff" : index % 2 === 0 ? "white" : "#f8fafc",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: selectedIds.includes(student.id) ? "#e0f2fe" : "#f1f5f9",
              },
              "& .MuiTableCell-root": {
                border: "none",
                py: 1.5,
              },
            }}
          >
            {alertState.open && (
              <ErrorAlert
                alertState={alertState}
                setAlertState={(value) =>
                  typeof value === "function" ? onAlertStateChange(value(alertState)) : onAlertStateChange(value)
                }
              />
            )}

            {/* 1. Checkbox */}
            <TableCell
              padding="checkbox"
              sx={{
                border: "none",
                width: "45px",
                minWidth: "45px",
                maxWidth: "45px",
                px: 0.5,
              }}
            >
              <Checkbox
                checked={selectedIds.includes(student.id)}
                onChange={() => handleSelect(student.id)}
                sx={{
                  color: "#94a3b8",
                  "&.Mui-checked": {
                    color: "#3b82f6",
                  },
                }}
              />
            </TableCell>

            {/* 2. שם פרטי */}
            <TableCell
              sx={{
                fontWeight: 600,
                color: "#0f172a",
                textAlign: "right",
                border: "none",
                width: "85px",
                minWidth: "85px",
                px: 1,
                fontSize: "0.85rem",
              }}
            >
              {student.firstName || (
                <Chip
                  label="לא זמין"
                  size="small"
                  sx={{
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                    fontSize: "0.65rem",
                    height: 18,
                  }}
                />
              )}
            </TableCell>

            {/* 3. שם משפחה */}
            <TableCell
              sx={{
                color: "#475569",
                textAlign: "right",
                border: "none",
                width: "85px",
                minWidth: "85px",
                px: 1,
                fontSize: "0.85rem",
              }}
            >
              {student.lastName || (
                <Chip
                  label="לא זמין"
                  size="small"
                  sx={{
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                    fontSize: "0.65rem",
                    height: 18,
                  }}
                />
              )}
            </TableCell>

            {/* 4. שם האב */}
            <TableCell
              sx={{
                color: "#475569",
                textAlign: "right",
                border: "none",
                width: "85px",
                minWidth: "85px",
                px: 1,
                fontSize: "0.85rem",
              }}
            >
              {student.fatherName || (
                <Chip
                  label="לא זמין"
                  size="small"
                  sx={{
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                    fontSize: "0.65rem",
                    height: 18,
                  }}
                />
              )}
            </TableCell>

            {/* 5. כתובת */}
            <TableCell
              sx={{
                color: "#475569",
                textAlign: "right",
                border: "none",
                width: "100px",
                minWidth: "100px",
                px: 1,
                fontSize: "0.85rem",
              }}
            >
              {student.address || (
                <Chip
                  label="לא זמין"
                  size="small"
                  sx={{
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                    fontSize: "0.65rem",
                    height: 18,
                  }}
                />
              )}
            </TableCell>

            {/* 6. עיר */}
            <TableCell
              sx={{
                color: "#475569",
                textAlign: "right",
                border: "none",
                width: "70px",
                minWidth: "70px",
                px: 1,
                fontSize: "0.85rem",
              }}
            >
              {student.city || (
                <Chip
                  label="לא זמין"
                  size="small"
                  sx={{
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                    fontSize: "0.65rem",
                    height: 18,
                  }}
                />
              )}
            </TableCell>

            {/* 7. טלפון */}
            <TableCell
              sx={{
                color: "#475569",
                textAlign: "right",
                border: "none",
                width: "90px",
                minWidth: "90px",
                px: 1,
                fontSize: "0.85rem",
              }}
            >
              {student.phone || (
                <Chip
                  label="לא זמין"
                  size="small"
                  sx={{
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                    fontSize: "0.65rem",
                    height: 18,
                  }}
                />
              )}
            </TableCell>

            {/* 8. כיתה */}
            <TableCell
              sx={{
                textAlign: "right",
                border: "none",
                width: "95px",
                minWidth: "95px",
                px: 1,
              }}
            >
              {editingStudentId === student.id ? (
                <select
                  value={selectedGroup ?? ""}
                  onChange={(e) => handleChange(e, student)}
                  onBlur={() => onEditingStudentIdChange(null)}
                  style={{
                    border: "2px solid #3b82f6",
                    borderRadius: "6px",
                    padding: "4px 6px",
                    fontSize: "11px",
                    outline: "none",
                    backgroundColor: "white",
                    boxShadow: "0 1px 3px -1px rgb(0 0 0 / 0.1)",
                    width: "100%",
                    maxWidth: "85px",
                  }}
                  autoFocus
                >
                  <option value="" disabled>
                    בחר קבוצה
                  </option>
                  {classrooms.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              ) : (
                <Box
                  onClick={() => onEditingStudentIdChange(student.id)}
                  sx={{
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  {student.groupId && classrooms.find((cls) => cls.id === student.groupId) ? (
                    <Chip
                      label={classrooms.find((cls) => cls.id === student.groupId)?.name}
                      size="small"
                      sx={{
                        backgroundColor: "#eff6ff",
                        color: "#3b82f6",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: 22,
                        "&:hover": {
                          backgroundColor: "#dbeafe",
                        },
                      }}
                    />
                  ) : (
                    <Chip
                      label="בחר קבוצה"
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "#d1d5db",
                        color: "#6b7280",
                        fontSize: "0.7rem",
                        height: 22,
                        "&:hover": {
                          borderColor: "#3b82f6",
                          color: "#3b82f6",
                        },
                      }}
                    />
                  )}
                </Box>
              )}
            </TableCell>

            {/* 9. סטטוס רישום */}
            <TableCell
              sx={{
                textAlign: "right",
                border: "none",
                width: "100px",
                minWidth: "100px",
                px: 1,
              }}
            >
              <Button
                variant="contained"
                size="small"
                sx={{
                  minWidth: 85,
                  height: 32,
                  bgcolor: student.registerStudent ? "#10b981" : "#3b82f6",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: 2,
                  fontSize: "0.7rem",
                  boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.1)",
                  "&:hover": {
                    bgcolor: student.registerStudent ? "#059669" : "#2563eb",
                    boxShadow: "0 2px 4px 0 rgb(0 0 0 / 0.15)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
                onClick={() => handleRegister(student)}
                startIcon={
                  student.registerStudent ? <CheckCircle sx={{ fontSize: 14 }} /> : <PersonAdd sx={{ fontSize: 14 }} />
                }
              >
                {student.registerStudent ? "רשום" : "רישום"}
              </Button>
            </TableCell>

            {/* 10. פעולות */}
            <TableCell
              sx={{
                textAlign: "right",
                border: "none",
                width: "100px",
                minWidth: "100px",
                px: 1,
              }}
            >
              <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(student, false)}
                  sx={{
                    color: "#64748b",
                    width: 28,
                    height: 28,
                    "&:hover": {
                      color: "#3b82f6",
                      backgroundColor: "#eff6ff",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <AccountBox sx={{ fontSize: 16 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(student, true)}
                  sx={{
                    color: "#64748b",
                    width: 28,
                    height: 28,
                    "&:hover": {
                      color: "#f59e0b",
                      backgroundColor: "#fef3c7",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Edit sx={{ fontSize: 16 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(student.id)}
                  sx={{
                    color: "#64748b",
                    width: 28,
                    height: 28,
                    "&:hover": {
                      color: "#ef4444",
                      backgroundColor: "#fee2e2",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Delete sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
        ))}
        {/* שורה ריקה בסוף לוודא שרואים את התלמיד האחרון */}
        <TableRow sx={{ height: "60px" }}>
          <TableCell colSpan={10} sx={{ border: "none", padding: 0 }} />
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default StudentsTableBody
