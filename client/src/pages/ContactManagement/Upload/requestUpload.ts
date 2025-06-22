import axiosInstant from 'api/baseRequest'

export const uploadImage = async (
  file,
  onUploadProgress?: (progress) => void,
  signal?: AbortSignal
) => {
  const formDataUpload = new FormData()
  formDataUpload.append('files', file)

  try {
    const { data } = await axiosInstant.request<any[]>({
      url: '/api/v1/blob',
      method: 'post',
      data: formDataUpload,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal,
      onUploadProgress(progressEvent) {
        onUploadProgress &&
          onUploadProgress(
            Math.floor((100 * progressEvent.loaded) / progressEvent.total)
          )
      },
    })
    return data
  } catch (error) {
    throw error
  }
}
