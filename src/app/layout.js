import './globals.css'

export const metadata = {
  title: 'Notepad',
  description: '记事本 - 支持离线和云端同步',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
