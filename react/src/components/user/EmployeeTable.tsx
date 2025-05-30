import type React from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Box, Typography,
} from "@mui/material"
import { Edit, Delete } from "@mui/icons-material"
import type { typeUser } from "../../moduls/User"

type Props = {
  employees: typeUser[]
  searchTerm: string
  onEdit: (employee: typeUser) => void
  onDelete: (employee: typeUser) => void
}

const EmployeeTable: React.FC<Props> = ({ employees, searchTerm, onEdit, onDelete }) => {
  const filtered = employees.filter(
    (e) =>
      (e.name ?? "").includes(searchTerm) ||
      (e.email ?? "").includes(searchTerm) ||
      (e.role ?? "").includes(searchTerm),
  )

  return (
    <Box sx={{ mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          direction: "rtl",
          zIndex: 1,
        }}
      >
        <TableContainer
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "#fafafa",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#333",
                    borderBottom: "3px solid #1976d2",
                    py: 2,
                    textAlign: "right",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  שם מלא
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#fafafa",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#333",
                    borderBottom: "3px solid #1976d2",
                    py: 2,
                    textAlign: "right",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  אימייל
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#fafafa",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#333",
                    borderBottom: "3px solid #1976d2",
                    py: 2,
                    textAlign: "right",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  תפקיד
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#fafafa",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#333",
                    borderBottom: "3px solid #1976d2",
                    py: 2,
                    textAlign: "right",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  סטטוס
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#fafafa",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#333",
                    borderBottom: "3px solid #1976d2",
                    py: 2,
                    textAlign: "center",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  פעולות
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((employee) => (
                <TableRow
                  key={employee.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                      transform: "scale(1.001)",
                      transition: "all 0.2s ease",
                    },
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#ffffff",
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "#fafafa",
                    },
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <TableCell sx={{ py: 2.5, textAlign: "right" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "#2c3e50",
                        fontSize: "0.95rem",
                      }}
                    >
                      {employee.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, textAlign: "right" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#5a6c7d",
                        fontFamily: "monospace",
                        fontSize: "0.9rem",
                      }}
                    >
                      {employee.email}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2.5, textAlign: "right" }}>
                    <Chip
                      label={employee.role}
                      size="small"
                      sx={{
                        backgroundColor: "#f5f5f5",
                        color: "#333",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        height: 28,
                        borderRadius: 2,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2.5, textAlign: "right" }}>
                    <Chip
                      label={employee.isActive ? "פעיל" : "לא פעיל"}
                      size="small"
                      sx={{
                        backgroundColor: employee.isActive ? "#e8f5e8" : "#fff3e0",
                        color: employee.isActive ? "#2e7d32" : "#f57c00",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        height: 28,
                        borderRadius: 2,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2.5, textAlign: "center" }}>
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                      <IconButton
                        onClick={() => onEdit(employee)}
                        size="small"
                        sx={{
                          backgroundColor: "#f5f5f5",
                          color: "#666",
                          width: 36,
                          height: 36,
                          "&:hover": {
                            backgroundColor: "#e0e0e0",
                            color: "#333",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => onDelete(employee)}
                        size="small"
                        sx={{
                          backgroundColor: "#f5f5f5",
                          color: "#666",
                          width: 36,
                          height: 36,
                          "&:hover": {
                            backgroundColor: "#e0e0e0",
                            color: "#333",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{
                      py: 6,
                      color: "#666",
                      fontSize: "1.1rem",
                      fontStyle: "italic",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#999" }}>
                      לא נמצאו עובדים תואמים
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default EmployeeTable
