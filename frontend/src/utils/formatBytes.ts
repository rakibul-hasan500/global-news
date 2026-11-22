export const formatBytes = (bytes=0) => {
    if(bytes === 0) return "0 Bytes"

    const size = ["Bytes", "KB", "MB", "GB", "TB"]

    let i = 0
    let value = bytes
    while(value >= 1024 && i < size.length - 1) {
        value = value / 1024
        i++
    }

    return `${value?.toFixed(2)} ${size[i]}`

}