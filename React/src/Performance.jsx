import {
    DetailsView,
    FileManagerComponent,
    Inject,
    NavigationPane,
    Toolbar
} from '@syncfusion/ej2-react-filemanager';

import { useRef, useState } from 'react';

function App() {

    const hostUrl = 'https://physical-service.syncfusion.com/';

    // FileManager initialization performance
    // (Stored locally and not displayed in UI)
    const lifecycleStartTime = useRef(performance.now());
    const componentInitializationTime = useRef(null);

    // Operation performance
    const operationStartTime = useRef(null);
    const firstFileLoadTime = useRef(null);
    const lastFileLoadTime = useRef(null);

    const [metrics, setMetrics] = useState({
        operation: '',
        dataLoadTime: 0,
        uiRenderTime: 0,
        totalLoadTime: 0
    });

    const ajaxSettings = {
        downloadUrl: hostUrl + 'api/PerformanceMetrics/Download',
        getImageUrl: hostUrl + 'api/PerformanceMetrics/GetImage',
        uploadUrl: hostUrl + 'api/PerformanceMetrics/Upload',
        url: hostUrl + 'api/PerformanceMetrics/FileOperations'
    };

    // Measure:
    // React lifecycle start -> FileManager created event
    function created() {

        componentInitializationTime.current =
            performance.now() - lifecycleStartTime.current;

    }

    function onBeforeSend(args) {

        if (args.action === 'read' || args.action === 'search') {

            operationStartTime.current = performance.now();

            // Reset values for current operation
            firstFileLoadTime.current = null;
            lastFileLoadTime.current = null;
        }
    }

    function OnFileLoad() {

        const currentTime = performance.now();

        // Capture first fileLoad event
        if (firstFileLoadTime.current === null) {
            firstFileLoadTime.current = currentTime;
        }

        // Always keep the latest fileLoad timestamp
        lastFileLoadTime.current = currentTime;
    }

    function OnSuccess(args) {

        if (
            (args.action === 'read' || args.action === 'search') &&
            operationStartTime.current !== null &&
            firstFileLoadTime.current !== null &&
            lastFileLoadTime.current !== null
        ) {

            const dataLoadTime =
                firstFileLoadTime.current -
                operationStartTime.current;

            const uiRenderTime =
                lastFileLoadTime.current -
                firstFileLoadTime.current;

            const totalLoadTime =
                lastFileLoadTime.current -
                operationStartTime.current;

            setMetrics({
                operation: args.action.toUpperCase(),
                dataLoadTime,
                uiRenderTime,
                totalLoadTime
            });

            console.log(
                `${args.action.toUpperCase()} Performance`,
                {
                    dataLoadTime,
                    uiRenderTime,
                    totalLoadTime
                }
            );

            // Reset operation tracking
            operationStartTime.current = null;
            firstFileLoadTime.current = null;
            lastFileLoadTime.current = null;
        }
    }

    return (
        <div>
            <div className="control-section">

                <div
                    style={{
                        marginBottom: '16px',
                        padding: '16px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                >
                    <div
                        style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '12px'
                        }}
                    >
                        {metrics.operation
                            ? `${metrics.operation} Performance Metrics`
                            : 'Perform a Read or Search operation'}
                    </div>

                    {metrics.operation && (
                        <div
                            style={{
                                display: 'flex',
                                gap: '12px',
                                flexWrap: 'wrap'
                            }}
                        >
                            {/* Data Load Time */}
                            <div
                                style={{
                                    flex: '1',
                                    minWidth: '180px',
                                    padding: '12px',
                                    backgroundColor: '#eff6ff',
                                    border: '1px solid #bfdbfe',
                                    borderRadius: '6px'
                                }}
                            >
                                <div
                                    style={{
                                        color: '#2563eb',
                                        fontSize: '12px',
                                        marginBottom: '4px'
                                    }}
                                >
                                    Data Load Time
                                </div>

                                <div
                                    style={{
                                        color: '#1e40af',
                                        fontSize: '22px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {metrics.dataLoadTime.toFixed(2)} ms
                                </div>
                            </div>

                            {/* UI Render Time */}
                            <div
                                style={{
                                    flex: '1',
                                    minWidth: '180px',
                                    padding: '12px',
                                    backgroundColor: '#ecfdf5',
                                    border: '1px solid #a7f3d0',
                                    borderRadius: '6px'
                                }}
                            >
                                <div
                                    style={{
                                        color: '#059669',
                                        fontSize: '12px',
                                        marginBottom: '4px'
                                    }}
                                >
                                    UI Render Time
                                </div>

                                <div
                                    style={{
                                        color: '#047857',
                                        fontSize: '22px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {metrics.uiRenderTime.toFixed(2)} ms
                                </div>
                            </div>

                            {/* Total Load Time */}
                            <div
                                style={{
                                    flex: '1',
                                    minWidth: '180px',
                                    padding: '12px',
                                    backgroundColor: '#fffbeb',
                                    border: '1px solid #fde68a',
                                    borderRadius: '6px'
                                }}
                            >
                                <div
                                    style={{
                                        color: '#d97706',
                                        fontSize: '12px',
                                        marginBottom: '4px'
                                    }}
                                >
                                    Total Load Time
                                </div>

                                <div
                                    style={{
                                        color: '#b45309',
                                        fontSize: '22px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {metrics.totalLoadTime.toFixed(2)} ms
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <FileManagerComponent
                    ajaxSettings={ajaxSettings}
                    beforeSend={onBeforeSend}
                    fileLoad={OnFileLoad}
                    success={OnSuccess}
                    created={created}
                >
                    <Inject
                        services={[
                            NavigationPane,
                            DetailsView,
                            Toolbar
                        ]}
                    />
                </FileManagerComponent>

            </div>
        </div>
    );
}

export default App;