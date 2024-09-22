import { showToastable, ToastableMessageStatus } from "react-native-toastable";


  const showToast = (message: string, status: ToastableMessageStatus, title?: string) => {
    showToastable({
      message,
      status,
      contentStyle: {
        backgroundColor: '#000',
        borderRadius: 16,
        padding: 20,
      },
      messageStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
    });
  }

  export { showToast };