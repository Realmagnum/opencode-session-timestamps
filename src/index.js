/**
 * Server half. It only carries the plugin's id: everything visible is the GUI
 * half, which reads the app's synced sessions and messages in the window.
 */
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "session-timestamps",
  setup() {},
})
