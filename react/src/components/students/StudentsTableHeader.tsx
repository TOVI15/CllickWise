"use client"

import type React from "react"
import { Table, TableHead, TableRow, TableCell, Checkbox } from "@mui/material"
import type { typeStudent } from "../../moduls/Student"

interface StudentsTableHeaderProps {
  selectedIds: number[]
  students: typeStudent[]
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>
}

const StudentsTableHeader: React.FC<StudentsTableHeaderProps> = ({ selectedIds, students, setSelectedIds }) => {
  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow
          sx={{
            backgroundColor: "white",
            "& .MuiTableCell-root": {
              border: "none",
              borderBottom: "2px solid #f1f5f9",
            },
          }}
        >
          {/* 1. Checkbox */}
          <TableCell
            padding="checkbox"
            sx={{
              backgroundColor: "white",
              border: "none",
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: "45px",
              minWidth: "45px",
              maxWidth: "45px",
              px: 0.5,
            }}
          >
            <Checkbox
              checked={selectedIds.length === students.length && students.length > 0}
              onChange={() =>
                setSelectedIds(selectedIds.length === students.length ? [] : students.map((student) => student.id))
              }
              sx={{
                p: 0.5,
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
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "0.8rem",
              backgroundColor: "white",
              border: "none",
              textAlign: "right",
              py: 1.5,
              px: 1,
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: "85px",
              minWidth: "85px",
            }}
          >
            שם פרטי
          </TableCell>

          {/* 3. שם משפחה */}
          <TableCell
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "0.8rem",
              backgroundColor: "white",
              border: "none",
              textAlign: "right",
              py: 1.5,
              px: 1,
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: "85px",
              minWidth: "85px",
            }}
          >
            שם משפחה
          </TableCell>

          {/* 4. שם האב */}
          <TableCell
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "0.8rem",
              backgroundColor: "white",
              border: "none",
              textAlign: "right",
              py: 1.5,
              px: 1,
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: "85px",
              minWidth: "85px",
            }}
          >
            שם האב
          </TableCell>

          {/* 5. כתובת */}
          <TableCell
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "0.8rem",
              backgroundColor: "white",
              border: "none",
              textAlign: "right",
              py: 1.5,
              px: 1,
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: "100px",
              minWidth: "100px",
            }}
          >
            כתובת
          </TableCell>

          {/* 6. עיר */}
          <TableCell
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "0.8rem",
              backgroundColor: "white",
              border: "none",
              textAlign: "right",
              py: 1.5,
              px: 1,
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: "70px",
              minWidth: "70px",
            }}
          >
            עיר
          </TableCell>

          {/* 7. טלפון */}
          <TableCell
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "0.8rem",
              backgroundColor: "white",
              border: "none",
              textAlign: "right",
              py: 1.5,
              px: 1,
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: "90px",
              minWidth: "90px",
            }}
          >
            טלפון
          </TableCell>

          {/* 8. כיתה */}
          <TableCell
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "0.8rem",
              backgroundColor: "white",
              border: "none",
              textAlign: "right",
              py: 1.5,
              px: 1,
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: "95px",
              minWidth: "95px",
            }}
          >
            כיתה
          </TableCell>

          {/* 9. סטטוס רישום */}
          <TableCell
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "0.8rem",
              backgroundColor: "white",
              border: "none",
              textAlign: "right",
              py: 1.5,
              px: 1,
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: "100px",
              minWidth: "100px",
            }}
          >
            סטטוס רישום
          </TableCell>

          {/* 10. פעולות */}
          <TableCell
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "0.8rem",
              backgroundColor: "white",
              border: "none",
              textAlign: "right",
              py: 1.5,
              px: 1,
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: "100px",
              minWidth: "100px",
            }}
          >
            פעולות
          </TableCell>
        </TableRow>
      </TableHead>
    </Table>
  )
}

export default StudentsTableHeader
