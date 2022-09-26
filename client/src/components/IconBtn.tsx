import React from 'react'
import { IconType } from 'react-icons'
import { IconTree } from 'react-icons/lib'

export interface IconBtnProps {
    Icon: IconType,
    isActive?: boolean,
    color?: string,
    children?: React.ReactNode
    onBtnClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
    disabled?: boolean
}

export function IconBtn({ Icon, isActive, disabled, color, children,onBtnClick, ...props }: IconBtnProps) {
    return (
        <button disabled={disabled} className={`btn icon-btn ${isActive ? "icon-btn-active" : ""} ${color || ""}`} onClick={onBtnClick} {...props} >
            <span className={`${children != null ? "mr-1": ""}`} ><Icon /></span>
            {children}
        </button>
    )
}