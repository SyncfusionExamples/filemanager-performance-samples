import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FileManagerModule,
  NavigationPaneService,
  ToolbarService,
  DetailsViewService
} from '@syncfusion/ej2-angular-filemanager';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FileManagerModule],
  providers: [
    NavigationPaneService,
    ToolbarService,
    DetailsViewService
  ],
  template: `
    <div class="control-section">

      <div
        style="
          margin-bottom:16px;
          padding:16px;
          border-radius:8px;
          background:#ffffff;
          border:1px solid #d1d5db;
          box-shadow:0 2px 4px rgba(0,0,0,0.08);
        "
      >
        <div
          style="
            font-size:18px;
            font-weight:600;
            color:#1e3a8a;
            margin-bottom:12px;
          "
        >
          {{
            metrics.operation
              ? metrics.operation + ' Performance Metrics'
              : 'Perform an operation to measure performance'
          }}
        </div>

        <div
          *ngIf="metrics.operation"
          style="
            display:flex;
            flex-wrap:wrap;
            gap:12px;
          "
        >

          <div
            style="
              flex:1;
              min-width:180px;
              padding:12px;
              background-color:#dbeafe;
              border-radius:6px;
              border:1px solid #93c5fd;
            "
          >
            <div
              style="
                font-size:13px;
                color:#1e40af;
                margin-bottom:6px;
              "
            >
              Data Load Time
            </div>

            <div
              style="
                font-size:22px;
                font-weight:bold;
                color:#1e3a8a;
              "
            >
              {{ metrics.dataLoadTime.toFixed(2) }} ms
            </div>
          </div>

          <div
            style="
              flex:1;
              min-width:180px;
              padding:12px;
              background-color:#dcfce7;
              border-radius:6px;
              border:1px solid #86efac;
            "
          >
            <div
              style="
                font-size:13px;
                color:#15803d;
                margin-bottom:6px;
              "
            >
              UI Render Time
            </div>

            <div
              style="
                font-size:22px;
                font-weight:bold;
                color:#166534;
              "
            >
              {{ metrics.uiRenderTime.toFixed(2) }} ms
            </div>
          </div>

          <div
            style="
              flex:1;
              min-width:180px;
              padding:12px;
              background-color:#fef3c7;
              border-radius:6px;
              border:1px solid #fcd34d;
            "
          >
            <div
              style="
                font-size:13px;
                color:#b45309;
                margin-bottom:6px;
              "
            >
              Total Load Time
            </div>

            <div
              style="
                font-size:22px;
                font-weight:bold;
                color:#92400e;
              "
            >
              {{ metrics.totalLoadTime.toFixed(2) }} ms
            </div>
          </div>

        </div>
      </div>

      <ejs-filemanager
        [ajaxSettings]="ajaxSettings"
        (created)="created()"
        (beforeSend)="onBeforeSend($event)"
        (fileLoad)="onFileLoad($event)"
        (success)="onSuccess($event)">
      </ejs-filemanager>

    </div>
  `
})
export class AppComponent implements OnInit {

  public hostUrl = 'https://physical-service.syncfusion.com/';

  public ajaxSettings!: Object;

  // Initial render timing
  private componentCreatedTime: number | null = null;
  private initialRenderTime: number | null = null;

  // Operation timing
  private operationStartTime: number | null = null;
  private firstFileLoadTime: number | null = null;
  private lastFileLoadTime: number | null = null;

  public metrics = {
    operation: '',
    dataLoadTime: 0,
    uiRenderTime: 0,
    totalLoadTime: 0
  };
private lifecycleStartTime: number = 0;
public createdEventTime: number = 0;
  ngOnInit(): void {
    this.lifecycleStartTime = performance.now();

    this.ajaxSettings = {
      url: this.hostUrl + 'api/PerformanceMetrics/FileOperations',
      getImageUrl: this.hostUrl + 'api/PerformanceMetrics/GetImage',
      uploadUrl: this.hostUrl + 'api/PerformanceMetrics/Upload',
      downloadUrl: this.hostUrl + 'api/PerformanceMetrics/Download'
    };

  }

  public created(): void {
        this.createdEventTime =
        performance.now() - this.lifecycleStartTime;
  }

  public onBeforeSend(args: any): void {

    if (args.action === 'read' || args.action === 'search') {

      this.operationStartTime = performance.now();
      this.firstFileLoadTime = null;
      this.lastFileLoadTime = null;
    }
  }

  public onFileLoad(args: any): void {

    const currentTime = performance.now();

    if (this.firstFileLoadTime === null) {
      this.firstFileLoadTime = currentTime;
    }

    this.lastFileLoadTime = currentTime;
  }

  public onSuccess(args: any): void {

    if (
      (args.action === 'read' || args.action === 'search') &&
      this.operationStartTime !== null &&
      this.firstFileLoadTime !== null &&
      this.lastFileLoadTime !== null
    ) {

      const dataLoadTime =
        this.firstFileLoadTime - this.operationStartTime;

      const uiRenderTime =
        this.lastFileLoadTime - this.firstFileLoadTime;

      const totalLoadTime =
        this.lastFileLoadTime - this.operationStartTime;

      this.metrics = {
        operation: args.action.toUpperCase(),
        dataLoadTime,
        uiRenderTime,
        totalLoadTime
      };

      this.operationStartTime = null;
      this.firstFileLoadTime = null;
      this.lastFileLoadTime = null;
    }
  }
}