"use client"

import { useNotification } from "@/contexts/NotificationContext"
import Notification from "./Notification"

const NotificationWrapper = () => {
  const { notifications, hideNotification } = useNotification()
  return <Notification notifications={notifications} onHide={hideNotification} />
}

export default NotificationWrapper
