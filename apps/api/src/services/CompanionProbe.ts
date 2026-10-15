import * as net from 'node:net';
import { CompanionStatusResponse } from '../types.js';

export class CompanionProbe {
  private defaultPort = 5892;

  /**
   * Performs an honest TCP probe to 127.0.0.1:5892 to determine whether a local Antigravity
   * companion service or daemon is actually running.
   */
  async probePort(port = this.defaultPort): Promise<CompanionStatusResponse> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      let isResolved = false;

      const finish = (isDaemonRunning: boolean, message: string) => {
        if (isResolved) return;
        isResolved = true;
        socket.destroy();
        resolve({
          status: isDaemonRunning ? 'connected' : 'disconnected',
          targetPort: port,
          isDaemonRunning,
          diagnosticMessage: message,
          testedAt: new Date().toISOString(),
        });
      };

      socket.setTimeout(800);

      socket.on('connect', () => {
        finish(
          true,
          `Active TCP socket detected on 127.0.0.1:${port}. Ready for authenticated Antigravity protocol handshake.`
        );
      });

      socket.on('timeout', () => {
        finish(
          false,
          `Connection timed out probing 127.0.0.1:${port}. No responsive daemon detected.`
        );
      });

      socket.on('error', (err: any) => {
        const reason = err.code === 'ECONNREFUSED'
          ? `No service listening on 127.0.0.1:${port} (ECONNREFUSED).`
          : `Socket probe error on port ${port}: ${err.message}`;
        finish(
          false,
          `${reason} Official Antigravity Remote Control workflow requires an active desktop daemon.`
        );
      });

      try {
        socket.connect(port, '127.0.0.1');
      } catch (err: any) {
        finish(false, `Socket connection exception: ${err.message}`);
      }
    });
  }
}
