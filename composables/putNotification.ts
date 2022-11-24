export const putNotification = async (args = {}) => {
  args = {
    title: 'Notification', // TODO: Add to translation
    ...args,
  }
  const { modal } = useWarningDialog(args)
  await modal.reveal()
}
