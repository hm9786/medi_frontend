"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({
  open,
  onOpenChange,
  ...props
}) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 오버레이 - 클릭해도 닫히지 않음 */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          {/* 다이얼로그 컨텐츠 */}
          <div className="relative z-50" {...props} />
        </div>
      )}
    </>
  )
}

function DialogContent({
  className,
  children,
  onClose,
  ...props
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-lg w-[95vw] h-[90vh] sm:w-[90vw] sm:h-[85vh] md:w-[85vw] md:h-[80vh] lg:w-[1200px] lg:h-[800px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-md bg-white hover:bg-gray-100 border border-gray-200 shadow-sm p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-5 w-5 text-gray-700" />
          <span className="sr-only">Close</span>
        </button>
      )}
      {children}
    </div>
  )
}

function DialogHeader({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left px-6 pt-6",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function DialogBody({
  className,
  ...props
}) {
  return (
    <div
      className={cn("px-6 py-4 flex-1 overflow-y-auto", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 pb-6",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
}


