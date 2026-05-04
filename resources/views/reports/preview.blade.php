<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Client Satisfaction Measurement Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', 'Segoe UI', 'Roboto', sans-serif;
            font-size: 11pt;
            line-height: 1.45;
            color: #1e293b;
            background: white;
            padding: 1.5in 1in 1in 1in;
        }

        .container {
            max-width: 100%;
            margin: 0 auto;
        }

        .page-break {
            page-break-before: always;
        }

        h1 {
            font-size: 26pt;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: #0f172a;
            margin: 0 0 0.6rem 0;
        }

        h2 {
            font-size: 16pt;
            font-weight: 600;
            margin: 1.8rem 0 0.8rem 0;
            padding-bottom: 6px;
            color: #0f172a;
            border-bottom: 2px solid #991b1b;
            display: inline-block;
        }

        h3 {
            font-size: 14pt;
            font-weight: 600;
            margin: 1.2rem 0 0.6rem 0;
            color: #334155;
        }

        h4 {
            font-size: 12pt;
            font-weight: 600;
            margin: 1rem 0 0.5rem 0;
            color: #475569;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 0.8rem 0 1.2rem 0;
            font-size: 10pt;
            background: white;
        }

        th, td {
            border: 1px solid #d1d5db;
            padding: 8px 6px;
            vertical-align: top;
        }

        th {
            background: linear-gradient(135deg, #991b1b, #7f1d1d);
            color: rgb(86, 84, 84);
            font-weight: 600;
            text-transform: uppercase;
            font-size: 9pt;
            letter-spacing: 0.5px;
        }

        tr:nth-child(even) {
            background-color: #f8fafc;
        }

        .text-center {
            text-align: center;
        }

        .metrics-grid {
            text-align: center;
            margin: 1rem 0 1.5rem 0;
        }

        .metric-card {
            display: inline-block;
            width: 150px;
            margin: 6px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 12px 6px;
            text-align: center;
        }

        .metric-card strong {
            display: block;
            font-size: 10pt;
            text-transform: uppercase;
            color: #896363;
            margin-bottom: 6px;
        }

        .metric-card br {
            display: none;
        }

        .metric-card br + * {
            font-size: 20pt;
            font-weight: 700;
            color: #0f172a;
        }

        .discussion-text {
            margin: 0.6rem 0 1rem 0;
            padding: 6px 0 6px 12px;
            border-left: 3px solid #cbd5e1;
            line-height: 1.5;
            color: #334155;
            font-size: 10pt;
        }

        .logo {
            max-height: 85px;
            width: auto;
            margin-bottom: 20px;
        }

        .title-page {
            text-align: center;
            margin-top: 2rem;
            padding: 1rem;
            border-bottom: 1px solid #e2e8f0;
        }

        footer {
            font-size: 8pt;
            text-align: center;
            margin-top: 2rem;
            padding-top: 0.8rem;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
        }

        ul {
            margin-left: 1.5rem;
            line-height: 1.6;
            color: #334155;
        }

        .bg-total {
            background-color: #f1f5f9;
            font-weight: bold;
        }
    </style>
</head>
<body>
<div class="container">

    <!-- ================= TITLE PAGE ================= -->
    <div class="title-page">
        @if(!empty($lguLogo))
            <img src="{{ $lguLogo }}" alt="LGU Logo" class="logo">
        @endif
        <h1>Local Government Unit of Opol</h1>
        <h2 style="border: none; margin-top: 10px;">Client Satisfaction Measurement Report</h2>
        <h3 style="font-weight: normal; margin-top: 5px;">(CSMR)</h3>
        <p style="margin-top: 30px; color: #475569;">{{ date('F d, Y') }}</p>
    </div>
    <div class="page-break"></div>

    <!-- ================= TABLE OF CONTENTS ================= -->
    <h2>Table of Contents</h2>
    <ul>
        <li>1. Overview</li>
        <li>2. Scope</li>
        <li>3. Methodology</li>
        <li>4. Data and Interpretation</li>
        <li>5. Continuous Agency Improvement Plan</li>
        <li>Annex A. Survey Questionnaire Used</li>
    </ul>
    <div class="page-break"></div>

    <!-- ================= 1. OVERVIEW ================= -->
    <h2>1. OVERVIEW</h2>

    @if(!empty($notes['overviewBefore']))
        <div class="discussion-text">{{ nl2br(e($notes['overviewBefore'])) }}</div>
    @endif

    <h3>Summary of Results</h3>
    <div class="metrics-grid">
        <div class="metric-card"><strong>CC Awareness</strong><br>{{ $summaryData['metrics']['cc_awareness'] }}%</div>
        <div class="metric-card"><strong>CC Visibility</strong><br>{{ $summaryData['metrics']['cc_visibility'] }}%</div>
        <div class="metric-card"><strong>CC Helpfulness</strong><br>{{ $summaryData['metrics']['cc_helpfulness'] }}%</div>
        <div class="metric-card"><strong>Response Rate</strong><br>{{ $summaryData['metrics']['response_rate'] }}%</div>
        <div class="metric-card"><strong>Overall Score</strong><br>{{ $summaryData['metrics']['overall_score'] }}%</div>
    </div>

    @if(!empty($notes['overviewAfter']))
        <div class="discussion-text">{{ nl2br(e($notes['overviewAfter'])) }}</div>
    @endif

    <div class="page-break"></div>

    <!-- ================= 2. SCOPE ================= -->
    <h2>2. SCOPE</h2>

    @if(!empty($notes['scopeBefore']))
        <div class="discussion-text">{{ nl2br(e($notes['scopeBefore'])) }}</div>
    @endif

    <h3>Service Summary</h3>
    @foreach(['internal', 'external'] as $cat)
        @if(!empty($serviceSummaryData['servicesByCategory'][$cat]))
            <h4>{{ ucfirst($cat) }} Services</h4>
            <table>
                <thead>
                <tr>
                    <th>Service Name</th>
                    <th>Survey Responses</th>
                    <th>Total Transactions</th>
                    <th>Response Rate</th>
                </tr>
                </thead>
                <tbody>
                @foreach($serviceSummaryData['servicesByCategory'][$cat] as $service)
                    <tr>
                        <td>{{ $service['name'] }}</td>
                        <td>{{ $service['responses'] }}</td>
                        <td>{{ $service['total_transactions'] }}</td>
                        <td>{{ $service['response_rate'] }}%</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        @endif
    @endforeach

    <div class="page-break"></div>

    <!-- ================= 3. METHODOLOGY ================= -->
    <h2>3. METHODOLOGY</h2>

    @if(!empty($notes['methodologyBefore']))
        <div class="discussion-text">{{ nl2br(e($notes['methodologyBefore'])) }}</div>
    @endif

    <h3>Likert Scale (1–5)</h3>
    <table>
        <thead>
        <tr>
            <th>Score</th>
            <th>Interpretation</th>
        </tr>
        </thead>
        <tbody>
        <tr><td class="text-center">5</td><td>Strongly Agree</td></tr>
        <tr><td class="text-center">4</td><td>Agree</td></tr>
        <tr><td class="text-center">3</td><td>Neither Agree nor Disagree</td></tr>
        <tr><td class="text-center">2</td><td>Disagree</td></tr>
        <tr><td class="text-center">1</td><td>Strongly Disagree</td></tr>
        </tbody>
    </table>

    <h3>Formula for Overall Score</h3>
    <p><strong>Overall Score (%)</strong> = (Sum of (Agree + Strongly Agree) responses) ÷ (Total valid responses – N/A) × 100</p>
    <p>Valid responses exclude "N/A" answers. The score reflects the percentage of respondents who agreed or strongly agreed with the service quality statements.</p>

    <div class="page-break"></div>

    <!-- ================= 4. DATA AND INTERPRETATION ================= -->
    <h2>4. DATA AND INTERPRETATION</h2>

    @if(!empty($notes['demographicBefore']))
        <div class="discussion-text">{{ nl2br(e($notes['demographicBefore'])) }}</div>
    @endif

    <h3>A. Demographic Profile</h3>

    <!-- Age Distribution -->
    <h4>Age Distribution</h4>
    <table>
        <thead>
        <tr>
            <th>Age Group</th>
            <th>Respondents</th>
            <th>Percentage</th>
        </tr>
        </thead>
        <tbody>
        @foreach($ageDistributionData['ageDistribution'] as $group => $data)
            <tr>
                <td>{{ $group }}</td>
                <td>{{ $data['count'] }}</td>
                <td>{{ $data['percentage'] }}%</td>
            </tr>
        @endforeach
        <tr class="bg-total">
            <td>Total</td>
            <td>{{ $ageDistributionData['total'] }}</td>
            <td>100%</td>
        </tr>
        </tbody>
    </table>
    @if($ageDistributionData['averageAge'])
        {{-- <p><strong>Average Age:</strong> {{ $ageDistributionData['averageAge'] }} years</p> --}}
    @endif
    @if(!empty($notes['ageDiscussion']))
        <div class="discussion-text">{{ nl2br(e($notes['ageDiscussion'])) }}</div>
    @endif

    <!-- Region Distribution -->
    <h4>Region Distribution</h4>
    <table>
        <thead>
        <tr>
            <th>Region</th>
            <th>Respondents</th>
            <th>Percentage</th>
        </tr>
        </thead>
        <tbody>
        @foreach($regionData['regions'] as $region => $count)
            <tr>
                <td>{{ $region }}</td>
                <td>{{ $count }}</td>
                <td>{{ $regionData['total'] ? round(($count / $regionData['total']) * 100, 1) : 0 }}%</td>
            </tr>
        @endforeach
        <tr class="bg-total">
            <td>Total</td>
            <td>{{ $regionData['total'] }}</td>
            <td>100%</td>
        </tr>
        </tbody>
    </table>
    @if(!empty($notes['regionDiscussion']))
        <div class="discussion-text">{{ nl2br(e($notes['regionDiscussion'])) }}</div>
    @endif

    <!-- Client Type Distribution -->
    <h4>Client Type Distribution</h4>
    <table>
        <thead>
        <tr>
            <th>Client Type</th>
            <th>Respondents</th>
        </tr>
        </thead>
        <tbody>
        @foreach($clientTypeData['clientTypes'] as $type => $count)
            <tr>
                <td>{{ ucfirst($type) }}</td>
                <td>{{ $count }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
    @if(!empty($notes['clientTypeDiscussion']))
        <div class="discussion-text">{{ nl2br(e($notes['clientTypeDiscussion'])) }}</div>
    @endif

    <div class="page-break"></div>

    <h3>B. Count of CC and SQD Results</h3>

    @if(!empty($notes['ccSqdBefore']))
        <div class="discussion-text">{{ nl2br(e($notes['ccSqdBefore'])) }}</div>
    @endif

    <!-- CC Summary -->
    <h4>Citizen's Charter (CC) Summary</h4>
    @foreach($ccSqdData['ccData'] as $qId => $cc)
        <p><strong>{{ $cc['question'] }}</strong></p>
        <table>
            <thead>
            <tr>
                <th>Code</th>
                <th>Response</th>
                <th>Count</th>
                <th>Percentage</th>
            </tr>
            </thead>
            <tbody>
            @foreach($cc['answer_stats'] as $stat)
                <tr>
                    <td>{{ $stat['code'] }}</td>
                    <td>{{ $stat['text'] }}</td>
                    <td>{{ $stat['count'] }}</td>
                    <td>{{ $stat['percentage'] }}%</td>
                </tr>
            @endforeach
            </tbody>
        </table>
        <p>Total Responses: {{ $cc['total_responses'] }}</p>
    @endforeach

    <!-- SQD Summary – no tfoot -->
    <h4>Service Quality (SQD) Summary</h4>
    <table>
        <thead>
        <tr>
            <th>Dimension</th>
            <th>SA</th><th>A</th><th>N</th><th>D</th><th>SD</th><th>N/A</th>
            <th>Total</th><th>Score</th>
        </tr>
        </thead>
        <tbody>
        @foreach($ccSqdData['sqdSummary']['questions'] as $q)
            <tr>
                <td>{{ $q['label'] }}</td>
                <td class="text-center">{{ $q['counts']['Strongly Agree'] }}</td>
                <td class="text-center">{{ $q['counts']['Agree'] }}</td>
                <td class="text-center">{{ $q['counts']['Neither Agree Nor Disagree'] }}</td>
                <td class="text-center">{{ $q['counts']['Disagree'] }}</td>
                <td class="text-center">{{ $q['counts']['Strongly Disagree'] }}</td>
                <td class="text-center">{{ $q['counts']['N/A (Not Applicable)'] }}</td>
                <td class="text-center">{{ $q['total'] }}</td>
                <td class="text-center font-bold">{{ $q['satisfaction_score'] }}%</td>
            </tr>
        @endforeach
        <tr class="bg-total">
            <td><strong>Total</strong></td>
            <td class="text-center">{{ $ccSqdData['sqdSummary']['overall_counts']['Strongly Agree'] }}</td>
            <td class="text-center">{{ $ccSqdData['sqdSummary']['overall_counts']['Agree'] }}</td>
            <td class="text-center">{{ $ccSqdData['sqdSummary']['overall_counts']['Neither Agree Nor Disagree'] }}</td>
            <td class="text-center">{{ $ccSqdData['sqdSummary']['overall_counts']['Disagree'] }}</td>
            <td class="text-center">{{ $ccSqdData['sqdSummary']['overall_counts']['Strongly Disagree'] }}</td>
            <td class="text-center">{{ $ccSqdData['sqdSummary']['overall_counts']['N/A (Not Applicable)'] }}</td>
            <td class="text-center">{{ $ccSqdData['sqdSummary']['overall_total'] }}</td>
            <td class="text-center">—</td>
        </tr>
        </tbody>
    </table>

    <div class="discussion-text">
        <strong>Overall Satisfaction:</strong> {{ $ccSqdData['sqdSummary']['overall_satisfaction'] }}%
        <p class="mt-2"><em>(Strongly Agree + Agree) ÷ (Total Responses - N/A) × 100</em></p>
    </div>

    @if(!empty($notes['ccSqdDiscussion']))
        <div class="discussion-text">{{ nl2br(e($notes['ccSqdDiscussion'])) }}</div>
    @endif

    <div class="page-break"></div>

    <h3>C. Overall Score per Service</h3>

    @if(!empty($notes['serviceRatingsBefore']))
        <div class="discussion-text">{{ nl2br(e($notes['serviceRatingsBefore'])) }}</div>
    @endif

    <div class="discussion-text">
        <strong>Overall Rating:</strong> {{ $serviceRatingsData['overallRating'] !== null ? $serviceRatingsData['overallRating'] . '%' : 'N/A' }}
    </div>

    @foreach(['internal', 'external'] as $cat)
        @php
            $filtered = array_filter($serviceRatingsData['serviceRatings'], fn($s) => $s['category'] === $cat);
        @endphp
        @if(!empty($filtered))
            <h4>{{ ucfirst($cat) }} Services</h4>
            <table>
                <thead>
                <tr>
                    <th>Service</th>
                    <th>Rating</th>
                </tr>
                </thead>
                <tbody>
                @foreach($filtered as $service)
                    <tr>
                        <td>{{ $service['name'] }}</td>
                        <td>{{ $service['rating'] !== null ? $service['rating'] . '%' : 'No data' }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        @endif
    @endforeach

    @if(!empty($notes['serviceRatingsDiscussion']))
        <div class="discussion-text">{{ nl2br(e($notes['serviceRatingsDiscussion'])) }}</div>
    @endif

    <h3>D. Unused Services</h3>

    @if(!empty($notes['unusedServicesDiscussion']))
        <div class="discussion-text">{{ nl2br(e($notes['unusedServicesDiscussion'])) }}</div>
    @endif

    @if(empty($unusedServices))
        <p>All services have received at least one survey response.</p>
    @else
        <table>
            <thead>
            <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Survey Responses</th>
                <th>Total Transactions</th>
            </tr>
            </thead>
            <tbody>
            @foreach($unusedServices as $service)
                <tr>
                    <td>{{ $service['name'] }}</td>
                    <td>{{ ucfirst($service['category']) }}</td>
                    <td>{{ $service['responses'] }}</td>
                    <td>{{ $service['total_transactions'] }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @endif

    @if(!empty($notes['unusedServicesDiscussionAfter']))
        <div class="discussion-text">{{ nl2br(e($notes['unusedServicesDiscussionAfter'])) }}</div>
    @endif

    <div class="page-break"></div>

    <!-- ================= 5. Continuous Agency Improvement Plan ================= -->
    <h2>5. Continuous Agency Improvement Plan</h2>
    <div class="discussion-text">
        @if(!empty($notes['improvementPlan']))
            {{ nl2br(e($notes['improvementPlan'])) }}
        @else
            No improvement plan entered.
        @endif
    </div>

    <div class="page-break"></div>

    <!-- ================= ANNEX A ================= -->
    <h2>Annex A. Survey Questionnaire Used</h2>

    <h3>Citizen's Charter (CC) Questions</h3>
    @foreach($firstSetQuestions as $q)
        <p><strong>{{ $q->custom_id }}.</strong> {{ $q->question_text }}</p>
    @endforeach

    <h3>Service Quality Dimensions (SQD)</h3>
    @foreach($secondSetQuestions as $q)
        <p><strong>{{ $q->custom_id }}.</strong> {{ $q->question_text }}</p>
    @endforeach

    <p class="mt-4"><em>Respondents used a 5‑point Likert scale: Strongly Agree – Agree – Neither Agree nor Disagree – Disagree – Strongly Disagree (plus N/A option).</em></p>

    <footer>
        Generated on {{ date('F d, Y H:i:s') }}
    </footer>
</div>
</body>
</html>
