import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'k2j30muc',
    dataset: 'production'
  },
  /**
   * appId用于标识部署的Studio实例
   * 您可以在 https://www.sanity.io/manage/project/k2j30muc/studios 找到或创建一个
   */
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
    // appId: 'your-studio-app-id' // 在实际部署时取消注释并替换为真实的appId
  }
})