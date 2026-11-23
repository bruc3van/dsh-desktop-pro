/** Pure function shared by the settings page and injected connection card. */
export interface MarketInstallationStatusInput {
  mode?: string
  bundledMarketEnabled?: boolean
  marketRestartAvailable?: boolean
  bundledMarketInstallation?: {
    state: 'unknown' | 'missing' | 'incomplete' | 'registered' | 'unregistered'
    version?: string
    owned: boolean
    uninstalled?: boolean
    disabledInProfile?: boolean
  }
}

export function formatMarketInstallationStatus(status: MarketInstallationStatusInput, chinese: boolean): string {
  const m = status.bundledMarketInstallation
  let line: string
  if (m === undefined || m.state === 'unknown') {
    line = chinese ? '无法确认本地安装状态。' : 'Local installation status is unknown.'
  } else if (m.state === 'missing') {
    line = chinese ? '本地未安装。' : 'Not installed locally.'
  } else if (m.state === 'incomplete') {
    line = chinese ? '本地安装不完整。' : 'Local installation is incomplete.'
  } else {
    line = (chinese ? '本地已安装' : 'Installed locally')
      + (m.version !== undefined && m.version !== '' ? ' v' + m.version : '')
      + (m.state === 'unregistered'
        ? (chinese ? '，未登记加载。' : ', not registered to load.')
        : (chinese ? '，已登记加载（不代表当前会话已生效）。' : ', registered to load (current session activation is not confirmed).'))
  }
  if (status.mode !== 'local' && status.marketRestartAvailable !== true) {
    line += chinese
      ? ' 当前连接已有服务，此开关不会修改该服务；下次由客户端启动本地服务时生效。'
      : ' Connected to an existing server; this switch takes effect on the next client-managed local launch.'
  } else if (status.bundledMarketEnabled !== true) {
    line += (m !== undefined && m.state === 'registered' && !m.owned)
      ? (chinese ? ' 自动接入已关闭；当前用户安装不受此开关管理。' : ' Automatic loading is off; this switch does not manage the current user installation.')
      : (chinese
        ? ' 自动接入已关闭，下次由客户端启动本地服务时会移除客户端管理的市场副本；开启后再重启可尝试恢复。'
        : ' Automatic loading is off; the next client-managed local launch will remove the client-owned market copy. Enable it, then restart to attempt restoration.')
  } else if (m !== undefined && ((m.state === 'incomplete' && !m.owned) || (m.state === 'unregistered' && !m.owned))) {
    line += chinese
      ? ' 用户安装或残留阻止自动接入；请先通过插件管理完成卸载，再重启客户端。'
      : ' A user installation or leftover blocks automatic loading; finish removing it through plugin management, then restart the client.'
  } else if (m?.uninstalled === true) {
    line += chinese
      ? ' 已从插件管理卸载，重启不会自动重装；如需恢复，可在插件页重新安装，或关闭再开启此开关。'
      : ' Uninstalled from plugin management and will not be reinstalled automatically on restart; reinstall it in Plugins, or toggle this switch off and on to restore.'
  } else if (m?.disabledInProfile === true) {
    line += chinese
      ? ' 当前已在插件管理中停用，重启不会自动重新启用；如需使用，请在插件页重新打开开关。'
      : ' Disabled in plugin management and will not be re-enabled automatically on restart; enable it again in Plugins when needed.'
  } else if (m !== undefined && m.state !== 'registered' && m.state !== 'unknown') {
    line += chinese
      ? ' 下次由客户端启动本地服务时尝试恢复内置副本；当前会话可能仍保留旧界面。'
      : ' The next client-managed local launch will attempt to restore the bundled copy; the current session may retain the old interface.'
  }
  return line
}
