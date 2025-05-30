"use client"

import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { Link, useLocation } from "react-router"
import type { ReactNode } from "react"

interface NavigationItemProps {
  to: string
  icon: ReactNode
  text: string
  secondaryAction?: ReactNode
  onClick?: () => void
}

export function NavigationItem({ to, icon, text, secondaryAction, onClick }: NavigationItemProps) {
  const location = useLocation()
  const isSelected = location.pathname === to

  return (
    <ListItem
      disablePadding
      secondaryAction={secondaryAction}
      sx={{
        mb: 0.5,
        mx: 0.5,
        borderRadius: 2,
        background: isSelected ? "rgba(59, 130, 246, 0.08)" : "transparent",
        border: isSelected ? "1px solid rgba(59, 130, 246, 0.15)" : "1px solid transparent",
        transition: "all 0.2s ease",
        "&:hover": {
          background: isSelected ? "rgba(59, 130, 246, 0.12)" : "rgba(248, 250, 252, 0.8)",
          border: isSelected ? "1px solid rgba(59, 130, 246, 0.15)" : "1px solid rgba(148, 163, 184, 0.15)",
        },
      }}
    >
      <ListItemButton
        component={Link}
        to={to}
        onClick={onClick}
        selected={isSelected}
        sx={{
          borderRadius: 2,
          py: 0.75,
          px: 1.5,
          minHeight: "auto",
          "&.Mui-selected": {
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
          "&:hover": {
            backgroundColor: "transparent", // Let parent handle hover
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            ml: 1.5,
            color: isSelected ? "#3b82f6" : "#64748b",
            transition: "color 0.2s ease",
            "& svg": {
              fontSize: "1.1rem",
            },
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={{
            textAlign: "right",
            "& .MuiTypography-root": {
              fontWeight: isSelected ? 600 : 500,
              color: isSelected ? "#1e40af" : "#374151",
              fontSize: "0.875rem",
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  )
}
