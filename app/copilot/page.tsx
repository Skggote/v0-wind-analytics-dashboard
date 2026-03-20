'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Send, Plus, Download } from 'lucide-react';
import { generateAnomalies } from '@/lib/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function CoPilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Wind Farm AI Co-Pilot. I can help you with:\n\n• **Anomaly Analysis**: "Why is Turbine 12 vibrating too much?"\n• **Performance Insights**: "Which turbines are underperforming?"\n• **Maintenance Planning**: "When should we schedule maintenance?"\n• **Forecast Analysis**: "What\'s the expected output next week?"\n• **Financial Optimization**: "How can we reduce imbalance costs?"\n\nWhat would you like to know?',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const anomalies = generateAnomalies(100);
  const suggestedPrompts = [
    'Analyze the latest anomalies in the fleet',
    'Which turbines need maintenance urgently?',
    'What\'s the revenue forecast for this month?',
    'Explain the recent power output drop',
    'Generate maintenance recommendations',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        anomaly: 'Based on the latest SCADA data, I\'ve detected 5 active anomalies across your fleet. Turbine 12 is showing elevated vibration levels (0.85 mm/s, threshold: 0.75 mm/s), which could indicate bearing wear. Turbine 23 has been flagged for temperature spikes. I recommend prioritizing maintenance for Turbine 12 within the next 7 days.',
        maintenance: 'Current fleet analysis shows 3 turbines requiring urgent maintenance:\n1. **Turbine 12** - High vibration (Critical)\n2. **Turbine 15** - Temperature spike (High)\n3. **Turbine 8** - Bearing wear (Medium)\n\nOptimal maintenance window: Days 5-6 (low wind forecast). Estimated downtime: 24-36 hours per turbine.',
        forecast: 'Revenue forecast for the next 30 days: **$425,000** (+8% vs previous month). Key insights:\n- Wind forecast: Favorable conditions next 10 days\n- Predicted capacity factor: 32-35%\n- Risk factors: Maintenance on 3 units will reduce output by ~8% for 2 days',
        performance: 'Fleet performance analysis shows overall capacity factor at 31.2%, which is 2.1% above the 30-day average. However, 12% of your turbines are underperforming. Top issues:\n- 4 turbines operating below 25% capacity\n- 3 units have anomalies affecting efficiency\n\nRecommended actions: Prioritize anomaly resolution and schedule predictive maintenance.',
        cost: 'Imbalance cost analysis reveals opportunities to reduce costs by 15-20%. Current monthly imbalance costs: $12,500. Recommendations:\n1. Improve forecast accuracy (currently 92%) → target 95%\n2. Optimize power dispatch during high-variance periods\n3. Implement predictive curtailment for extreme weather\n\nImplementing these changes could save ~$2,000/month.',
      };

      let response = responses.anomaly;
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('maintenance') || lowerInput.includes('urgent')) {
        response = responses.maintenance;
      } else if (lowerInput.includes('revenue') || lowerInput.includes('forecast')) {
        response = responses.forecast;
      } else if (lowerInput.includes('underperform') || lowerInput.includes('performance')) {
        response = responses.performance;
      } else if (lowerInput.includes('cost') || lowerInput.includes('imbalance')) {
        response = responses.cost;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Co-Pilot</h1>
            <p className="text-muted-foreground mt-1">
              Intelligent insights and recommendations for your wind farm
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
            <TabsTrigger value="insights">Insights & Reports</TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            <Card className="flex flex-col h-[600px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-4">
                      <Spinner className="w-4 h-4" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about anomalies, maintenance, forecasts..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={loading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || loading}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Suggested Prompts */}
                {messages.length <= 2 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedPrompts.map((prompt, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleSuggestedPrompt(prompt)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Active Anomalies */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">🚨 Active Anomalies</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {anomalies.slice(0, 5).map(anomaly => (
                    <div key={anomaly.id} className="p-2 bg-muted rounded text-sm">
                      <p className="font-medium">{anomaly.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {anomaly.turbineId} • Severity: {anomaly.severity}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Key Recommendations */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">💡 Key Recommendations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>Schedule maintenance for Turbine 12 within 7 days</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>Implement predictive maintenance for high-risk units</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>Optimize bid strategy during low wind periods</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>Reduce imbalance costs through better forecasting</span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Performance Summary */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">📊 Fleet Performance Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm">Overall Health Score</span>
                  <span className="font-semibold">82.4%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm">Capacity Factor (30-day avg)</span>
                  <span className="font-semibold">31.2%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm">Turbines Requiring Attention</span>
                  <span className="font-semibold text-destructive">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monthly Revenue (Projected)</span>
                  <span className="font-semibold">$425,000</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
