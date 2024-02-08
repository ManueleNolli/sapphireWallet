import { useEffect, useState } from 'react'
import { BarCodeScanner, PermissionStatus } from 'expo-barcode-scanner'

type QRCodeScannerProps = {
  onQRCodeScanned: (data: string) => void
}

export default function useQRCodeScanner({
  onQRCodeScanned,
}: QRCodeScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === PermissionStatus.GRANTED)
    }
    if (!hasPermission) getBarCodeScannerPermissions()
  }, [])

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true)
    onQRCodeScanned(data)
  }

  return { scanned, handleBarCodeScanned }
}
