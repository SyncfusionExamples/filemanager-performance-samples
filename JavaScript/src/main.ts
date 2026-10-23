import { FileManager, Toolbar, NavigationPane, DetailsView } from '@syncfusion/ej2-filemanager';
import './style.css';

FileManager.Inject(Toolbar, NavigationPane, DetailsView);

let hostUrl: string = 'https://physical-service.syncfusion.com/';

// Operation timing
let operationStartTime: number | null = null;
let firstFileLoadTime: number | null = null;
let lastFileLoadTime: number | null = null;
// Created event timing
let lifecycleStartTime: number = performance.now();
let createdEventTime: number = 0;
const metricsContainer = document.getElementById('metrics');

let filemanagerInstance: FileManager = new FileManager({

  ajaxSettings: {
    url: hostUrl + 'api/PerformanceMetrics/FileOperations',
    getImageUrl: hostUrl + 'api/PerformanceMetrics/GetImage',
    uploadUrl: hostUrl + 'api/PerformanceMetrics/Upload',
    downloadUrl: hostUrl + 'api/PerformanceMetrics/Download'
  },
  created: function () {
    createdEventTime = performance.now() - lifecycleStartTime;
  },
  beforeSend: function (args) {

    if (args.action === 'read' || args.action === 'search') {

      operationStartTime = performance.now();
      firstFileLoadTime = null;
      lastFileLoadTime = null;
    }
  },

  fileLoad: function () {

    const currentTime = performance.now();

    if (firstFileLoadTime === null) {
      firstFileLoadTime = currentTime;
    }

    lastFileLoadTime = currentTime;
  },

  success: function (args) {

    if (
      (args.action === 'read' || args.action === 'search') &&
      operationStartTime !== null &&
      firstFileLoadTime !== null &&
      lastFileLoadTime !== null
    ) {

      const dataLoadTime =
        firstFileLoadTime - operationStartTime;

      const uiRenderTime =
        lastFileLoadTime - firstFileLoadTime;

      const totalLoadTime =
        lastFileLoadTime - operationStartTime;

      metricsContainer!.innerHTML = `
                <div class="metrics-wrapper">
                    <div class="metrics-title">
                        ${args.action.toUpperCase()} Performance Metrics
                    </div>

                    <div class="metrics-cards">

                        <div class="metric-card metric-blue">
                            <div class="metric-label">
                                Data Load Time
                            </div>
                            <div class="metric-value">
                                ${dataLoadTime.toFixed(2)} ms
                            </div>
                        </div>

                        <div class="metric-card metric-green">
                            <div class="metric-label">
                                UI Render Time
                            </div>
                            <div class="metric-value">
                                ${uiRenderTime.toFixed(2)} ms
                            </div>
                        </div>

                        <div class="metric-card metric-yellow">
                            <div class="metric-label">
                                Total Load Time
                            </div>
                            <div class="metric-value">
                                ${totalLoadTime.toFixed(2)} ms
                            </div>
                        </div>

                    </div>
                </div>
            `;

      operationStartTime = null;
      firstFileLoadTime = null;
      lastFileLoadTime = null;
    }
  }
});

filemanagerInstance.appendTo('#filemanager');