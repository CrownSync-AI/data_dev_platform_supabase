'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Copy, 
  Share2, 
  FileImage, 
  Calendar, 
  CheckSquare,
  AlertCircle,
  Target,
  Zap
} from 'lucide-react';

interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'budget' | 'content' | 'timing' | 'audience';
  title: string;
  description: string;
  estimatedImpact: string;
  action: string;
  actionType: 'copy_template' | 'share_retailer' | 'generate_assets' | 'schedule_post' | 'create_task';
}

interface RecommendationCardsProps {
  recommendations: Recommendation[];
}

export default function RecommendationCards({ recommendations }: RecommendationCardsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'budget': return <DollarSign className="h-4 w-4" />;
      case 'content': return <FileImage className="h-4 w-4" />;
      case 'timing': return <Clock className="h-4 w-4" />;
      case 'audience': return <Users className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'budget': return 'text-green-600 bg-green-50';
      case 'content': return 'text-purple-600 bg-purple-50';
      case 'timing': return 'text-blue-600 bg-blue-50';
      case 'audience': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'copy_template': return <Copy className="h-4 w-4" />;
      case 'share_retailer': return <Share2 className="h-4 w-4" />;
      case 'generate_assets': return <FileImage className="h-4 w-4" />;
      case 'schedule_post': return <Calendar className="h-4 w-4" />;
      case 'create_task': return <CheckSquare className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getActionButtonText = (actionType: string) => {
    switch (actionType) {
      case 'copy_template': return 'Copy Template';
      case 'share_retailer': return 'Share with Retailer';
      case 'generate_assets': return 'Generate Assets';
      case 'schedule_post': return 'Schedule Post';
      case 'create_task': return 'Create Task';
      default: return 'Take Action';
    }
  };

  const handleActionClick = (recommendation: Recommendation) => {
    // Mock action handling - in real implementation, this would trigger actual actions
    console.log(`Executing action: ${recommendation.actionType} for recommendation: ${recommendation.id}`);
    
    // Show success message (in real app, use toast notification)
    alert(`Action "${recommendation.action}" has been initiated. Check your task list for updates.`);
  };

  // Sort recommendations by priority
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎯 Actionable Recommendations
        </CardTitle>
        <p className="text-gray-600">
          AI-powered suggestions to optimize campaign performance with estimated impact
        </p>
      </CardHeader>
      <CardContent>
        {/* Priority Summary */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="font-medium">High Priority:</span>
              <span className="text-red-700">{recommendations.filter(r => r.priority === 'high').length} items</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">Medium Priority:</span>
              <span className="text-yellow-700">{recommendations.filter(r => r.priority === 'medium').length} items</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-green-600" />
              <span className="font-medium">Low Priority:</span>
              <span className="text-green-700">{recommendations.filter(r => r.priority === 'low').length} items</span>
            </div>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid gap-4">
          {sortedRecommendations.map((recommendation) => (
            <Card 
              key={recommendation.id} 
              className={`border-l-4 ${
                recommendation.priority === 'high' ? 'border-l-red-500' :
                recommendation.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Category Icon */}
                    <div className={`p-2 rounded-lg ${getCategoryColor(recommendation.category)}`}>
                      {getCategoryIcon(recommendation.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority} priority
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {recommendation.category}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">
                        {recommendation.description}
                      </p>

                      {/* Impact Estimate */}
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Estimated Impact: {recommendation.estimatedImpact}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => handleActionClick(recommendation)}
                    className="ml-4 flex items-center gap-2"
                    variant={recommendation.priority === 'high' ? 'default' : 'outline'}
                  >
                    {getActionIcon(recommendation.actionType)}
                    {getActionButtonText(recommendation.actionType)}
                  </Button>
                </div>

                {/* Action Description */}
                <div className="ml-11 pl-3 border-l-2 border-gray-100">
                  <p className="text-xs text-gray-600">
                    <strong>Next Step:</strong> {recommendation.action}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Implementation Timeline */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">📅 Recommended Implementation Timeline</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium">Week 1:</span>
              <span className="text-gray-700">Implement high-priority recommendations (immediate impact)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">Week 2-3:</span>
              <span className="text-gray-700">Execute medium-priority optimizations (sustained growth)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Week 4+:</span>
              <span className="text-gray-700">Deploy low-priority enhancements (long-term optimization)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}