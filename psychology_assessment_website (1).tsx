import React, { useState, useEffect } from 'react';
import { Heart, Star, Sun, Moon, Smile, Users, ChevronRight, BarChart3, PieChart, ArrowLeft, Download } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';

const PsychologyAssessmentWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentScale, setCurrentScale] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // 内置量表数据
  const scales = {
    // PHQ-9 患者健康问卷
    'phq9': {
      id: 'phq9',
      name: 'PHQ-9 患者健康问卷',
      category: '抑郁评估',
      description: '用于筛查和评估抑郁症状严重程度的标准化工具',
      instructions: '在过去两周中，您有多少时候被以下问题困扰？',
      items: [
        { id: 1, text: '对事情失去兴趣或没有乐趣' },
        { id: 2, text: '感到心情低落、沮丧或绝望' },
        { id: 3, text: '入睡困难、睡眠不安稳或睡眠过多' },
        { id: 4, text: '感到疲倦或没有精力' },
        { id: 5, text: '胃口差或吃得过多' },
        { id: 6, text: '感到自己不好，或觉得自己是失败者，或让自己或家人失望' },
        { id: 7, text: '对事情专注有困难，如看报纸或看电视' },
        { id: 8, text: '动作或说话缓慢到别人已经察觉？或者相反—烦躁或坐立不安，比平时更爱活动' },
        { id: 9, text: '有不如死掉或伤害自己的念头' }
      ],
      options: [
        { value: 0, text: '完全没有', color: '#10B981' },
        { value: 1, text: '好几天', color: '#F59E0B' },
        { value: 2, text: '一半以上的天数', color: '#EF4444' },
        { value: 3, text: '几乎每天', color: '#DC2626' }
      ],
      scoring: {
        ranges: [
          { min: 0, max: 4, level: '无或最小程度抑郁', description: '心理状态良好，请继续保持', color: '#10B981' },
          { min: 5, max: 9, level: '轻度抑郁', description: '存在轻度抑郁症状，建议关注心理健康', color: '#F59E0B' },
          { min: 10, max: 14, level: '中度抑郁', description: '存在中度抑郁症状，建议寻求专业帮助', color: '#EF4444' },
          { min: 15, max: 19, level: '中重度抑郁', description: '存在较严重抑郁症状，强烈建议专业治疗', color: '#DC2626' },
          { min: 20, max: 27, level: '重度抑郁', description: '存在重度抑郁症状，请立即寻求专业医疗帮助', color: '#991B1B' }
        ]
      },
      dimensions: [
        { name: '情绪症状', items: [1, 2], color: '#EF4444' },
        { name: '身体症状', items: [3, 4, 5], color: '#F59E0B' },
        { name: '认知症状', items: [6, 7, 8], color: '#3B82F6' },
        { name: '自杀倾向', items: [9], color: '#7C2D12' }
      ]
    },

    // GAD-7 广泛性焦虑量表
    'gad7': {
      id: 'gad7',
      name: 'GAD-7 广泛性焦虑量表',
      category: '焦虑评估',
      description: '用于评估广泛性焦虑障碍症状严重程度的标准化工具',
      instructions: '在过去两周中，您有多少时候被以下问题困扰？',
      items: [
        { id: 1, text: '感到紧张、焦虑或急躁' },
        { id: 2, text: '无法停止或控制担忧' },
        { id: 3, text: '对各种各样的事情担忧过多' },
        { id: 4, text: '很难放松下来' },
        { id: 5, text: '烦躁得无法静坐' },
        { id: 6, text: '变得容易烦恼或急躁' },
        { id: 7, text: '感到害怕，好像有什么可怕的事情要发生' }
      ],
      options: [
        { value: 0, text: '完全没有', color: '#10B981' },
        { value: 1, text: '好几天', color: '#F59E0B' },
        { value: 2, text: '一半以上的天数', color: '#EF4444' },
        { value: 3, text: '几乎每天', color: '#DC2626' }
      ],
      scoring: {
        ranges: [
          { min: 0, max: 4, level: '无或轻微焦虑', description: '焦虑水平正常，请保持良好的生活习惯', color: '#10B981' },
          { min: 5, max: 9, level: '轻度焦虑', description: '存在轻度焦虑症状，可通过放松训练缓解', color: '#F59E0B' },
          { min: 10, max: 14, level: '中度焦虑', description: '存在中度焦虑症状，建议寻求专业帮助', color: '#EF4444' },
          { min: 15, max: 21, level: '重度焦虑', description: '存在重度焦虑症状，强烈建议专业治疗', color: '#DC2626' }
        ]
      },
      dimensions: [
        { name: '担忧症状', items: [1, 2, 3], color: '#F59E0B' },
        { name: '身体症状', items: [4, 5], color: '#EF4444' },
        { name: '情绪症状', items: [6, 7], color: '#3B82F6' }
      ]
    },

    // PSQI 匹兹堡睡眠质量指数
    'psqi': {
      id: 'psqi',
      name: 'PSQI 匹兹堡睡眠质量指数',
      category: '睡眠评估',
      description: '评估过去一个月睡眠质量的综合性量表',
      instructions: '请根据您过去一个月的实际睡眠情况回答以下问题',
      items: [
        { id: 1, text: '您通常几点上床睡觉？', type: 'time' },
        { id: 2, text: '您通常需要多长时间（分钟）才能入睡？', type: 'number' },
        { id: 3, text: '您通常几点起床？', type: 'time' },
        { id: 4, text: '您实际睡眠时间是多少小时？', type: 'number' },
        { id: 5, text: '不能在30分钟内入睡', type: 'frequency' },
        { id: 6, text: '夜间或早晨过早醒来', type: 'frequency' },
        { id: 7, text: '起夜上厕所', type: 'frequency' },
        { id: 8, text: '呼吸不畅', type: 'frequency' },
        { id: 9, text: '咳嗽或大声打鼾', type: 'frequency' },
        { id: 10, text: '感觉太冷', type: 'frequency' },
        { id: 11, text: '感觉太热', type: 'frequency' },
        { id: 12, text: '做噩梦', type: 'frequency' },
        { id: 13, text: '疼痛不适', type: 'frequency' },
        { id: 14, text: '总的来说，您的睡眠质量如何？', type: 'quality' },
        { id: 15, text: '您是否服用药物来帮助睡眠？', type: 'frequency' },
        { id: 16, text: '您是否因为困倦而难以保持清醒？', type: 'frequency' },
        { id: 17, text: '您保持充足精力来处理日常活动有多困难？', type: 'difficulty' }
      ],
      options: {
        frequency: [
          { value: 0, text: '过去一个月没有', color: '#10B981' },
          { value: 1, text: '少于每周1次', color: '#F59E0B' },
          { value: 2, text: '每周1-2次', color: '#EF4444' },
          { value: 3, text: '每周3次或以上', color: '#DC2626' }
        ],
        quality: [
          { value: 0, text: '非常好', color: '#10B981' },
          { value: 1, text: '比较好', color: '#F59E0B' },
          { value: 2, text: '比较差', color: '#EF4444' },
          { value: 3, text: '非常差', color: '#DC2626' }
        ],
        difficulty: [
          { value: 0, text: '完全没有困难', color: '#10B981' },
          { value: 1, text: '轻微困难', color: '#F59E0B' },
          { value: 2, text: '中等困难', color: '#EF4444' },
          { value: 3, text: '非常困难', color: '#DC2626' }
        ]
      },
      scoring: {
        ranges: [
          { min: 0, max: 5, level: '睡眠质量好', description: '您的睡眠质量很好，请继续保持良好的睡眠习惯', color: '#10B981' },
          { min: 6, max: 10, level: '睡眠质量一般', description: '睡眠质量有待改善，建议调整睡眠环境和习惯', color: '#F59E0B' },
          { min: 11, max: 15, level: '睡眠质量较差', description: '睡眠质量较差，建议咨询医生或睡眠专家', color: '#EF4444' },
          { min: 16, max: 21, level: '睡眠质量很差', description: '睡眠质量很差，强烈建议寻求专业医疗帮助', color: '#DC2626' }
        ]
      },
      dimensions: [
        { name: '睡眠质量', items: [14], color: '#3B82F6' },
        { name: '入睡时间', items: [2, 5], color: '#F59E0B' },
        { name: '睡眠时间', items: [4], color: '#10B981' },
        { name: '睡眠效率', items: [1, 3, 4], color: '#8B5CF6' },
        { name: '睡眠障碍', items: [6, 7, 8, 9, 10, 11, 12, 13], color: '#EF4444' },
        { name: '睡眠药物', items: [15], color: '#F97316' },
        { name: '日间功能', items: [16, 17], color: '#EC4899' }
      ]
    },

    // SDS Zung抑郁自评量表（简化版）
    'sds': {
      id: 'sds',
      name: 'SDS Zung抑郁自评量表',
      category: '抑郁评估',
      description: '经典的抑郁症状自我评估工具',
      instructions: '请根据您最近一周的感受，选择最符合您情况的选项',
      items: [
        { id: 1, text: '我感到情绪沮丧、郁闷' },
        { id: 2, text: '我感到早晨心情最好' },
        { id: 3, text: '我要哭或想哭' },
        { id: 4, text: '我夜间睡眠不好' },
        { id: 5, text: '我吃饭象平时一样多' },
        { id: 6, text: '我的性功能正常' },
        { id: 7, text: '我感到体重减轻' },
        { id: 8, text: '我为便秘烦恼' },
        { id: 9, text: '我的心跳比平时快' },
        { id: 10, text: '我无故感到疲劳' }
      ],
      options: [
        { value: 1, text: '很少时间', color: '#10B981' },
        { value: 2, text: '少部分时间', color: '#F59E0B' },
        { value: 3, text: '相当多时间', color: '#EF4444' },
        { value: 4, text: '绝大部分时间', color: '#DC2626' }
      ],
      scoring: {
        ranges: [
          { min: 10, max: 39, level: '正常范围', description: '心理状态正常，请保持良好的生活状态', color: '#10B981' },
          { min: 40, max: 47, level: '轻度抑郁', description: '存在轻度抑郁倾向，建议关注心理健康', color: '#F59E0B' },
          { id: 48, max: 55, level: '中度抑郁', description: '存在中度抑郁症状，建议寻求专业帮助', color: '#EF4444' },
          { min: 56, max: 80, level: '重度抑郁', description: '存在重度抑郁症状，请寻求专业医疗帮助', color: '#DC2626' }
        ]
      },
      dimensions: [
        { name: '情感症状', items: [1, 2, 3], color: '#EF4444' },
        { name: '身体症状', items: [4, 5, 7, 8, 9, 10], color: '#F59E0B' },
        { name: '功能症状', items: [6], color: '#3B82F6' }
      ]
    }
  };

  // 计算得分
  const calculateScore = (scale, responses) => {
    let totalScore = 0;
    const dimensionScores = {};
    
    // 初始化维度得分
    scale.dimensions.forEach(dim => {
      dimensionScores[dim.name] = 0;
    });

    // 计算总分和维度得分
    scale.items.forEach(item => {
      const response = responses[item.id];
      if (response !== undefined) {
        totalScore += response;
        
        // 计算维度得分
        scale.dimensions.forEach(dim => {
          if (dim.items.includes(item.id)) {
            dimensionScores[dim.name] += response;
          }
        });
      }
    });

    return { totalScore, dimensionScores };
  };

  // 获取评分解释
  const getScoreInterpretation = (score, scale) => {
    return scale.scoring.ranges.find(range => score >= range.min && score <= range.max) || scale.scoring.ranges[0];
  };

  // 开始测评
  const startAssessment = (scaleId) => {
    setCurrentScale(scales[scaleId]);
    setCurrentQuestion(0);
    setResponses({});
    setCurrentPage('assessment');
  };

  // 处理回答
  const handleResponse = (value) => {
    const newResponses = { ...responses, [currentScale.items[currentQuestion].id]: value };
    setResponses(newResponses);
    
    if (currentQuestion < currentScale.items.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 完成测评，显示提交对话框
      setShowSubmitDialog(true);
    }
  };

  // 提交测评结果
  const submitAssessment = () => {
    const result = calculateScore(currentScale, responses);
    const interpretation = getScoreInterpretation(result.totalScore, currentScale);
    
    const assessment = {
      id: Date.now().toString(),
      scaleId: currentScale.id,
      scaleName: currentScale.name,
      category: currentScale.category,
      result,
      interpretation,
      completedAt: new Date().toLocaleString(),
      responses: responses
    };
    
    setAssessmentResults([...assessmentResults, assessment]);
    setCurrentResult(assessment);
    setShowSubmitDialog(false);
    setCurrentPage('result');
  };

  // 主页
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50">
      {/* 头部 */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-gradient-to-r from-pink-200 to-blue-200 rounded-full p-4">
              <Heart className="w-12 h-12 text-rose-600" />
            </div>
          </div>

          {/* 提交确认对话框 */}
          {showSubmitDialog && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">完成测评</h3>
                  <p className="text-gray-600 leading-relaxed">
                    您已完成所有题目，感谢您的耐心回答。
                    <br />
                    测评结果将为您提供专业的分析和建议，
                    <br />
                    帮助您更好地了解自己的心理状态。
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 text-center">
                    <strong>温馨提示：</strong>此评估仅供参考，不能替代专业医疗诊断。如有需要，请咨询专业心理健康工作者。
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSubmitDialog(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    继续检查
                  </button>
                  <button
                    onClick={submitAssessment}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                  >
                    提交测评
                  </button>
                </div>
              </div>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
            心理健康
            <span className="text-rose-500 font-normal"> · </span>
            自我关爱
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            给自己一点时间，了解内心的声音<br/>
            专业的心理评估，温暖的自我发现之旅
          </p>
        </div>

        {/* 量表分类 */}
        <div className="space-y-8">
          {/* 抑郁评估 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <Sun className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-medium text-gray-800">情绪健康评估</h2>
                <p className="text-gray-600">了解您的情绪状态，关爱内心感受</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div 
                onClick={() => startAssessment('phq9')}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-blue-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-800">PHQ-9 患者健康问卷</h3>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-3">评估抑郁症状的标准工具</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="w-4 h-4 mr-1" />
                  <span>9题 · 5分钟</span>
                </div>
              </div>
              
              <div 
                onClick={() => startAssessment('sds')}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-blue-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-800">SDS 抑郁自评量表</h3>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-3">经典的抑郁症状评估工具</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="w-4 h-4 mr-1" />
                  <span>10题 · 3分钟</span>
                </div>
              </div>
            </div>
          </div>

          {/* 焦虑评估 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <Smile className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-medium text-gray-800">焦虑状态评估</h2>
                <p className="text-gray-600">了解焦虑水平，学会放松自己</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div 
                onClick={() => startAssessment('gad7')}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-green-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-800">GAD-7 广泛性焦虑量表</h3>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-3">评估焦虑症状的专业工具</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="w-4 h-4 mr-1" />
                  <span>7题 · 3分钟</span>
                </div>
              </div>
            </div>
          </div>

          {/* 睡眠评估 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 rounded-full p-3 mr-4">
                <Moon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-medium text-gray-800">睡眠质量评估</h2>
                <p className="text-gray-600">评估睡眠状况，改善休息质量</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div 
                onClick={() => startAssessment('psqi')}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-purple-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-800">PSQI 睡眠质量指数</h3>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-3">综合评估睡眠质量的标准工具</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="w-4 h-4 mr-1" />
                  <span>17题 · 8分钟</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 历史记录 */}
        {assessmentResults.length > 0 && (
          <div className="mt-12 bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-orange-100 rounded-full p-3 mr-4">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-medium text-gray-800">我的评估记录</h2>
                  <p className="text-gray-600">回顾过往，见证成长</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {assessmentResults.slice(-3).map(result => (
                <div 
                  key={result.id}
                  onClick={() => { setCurrentResult(result); setCurrentPage('result'); }}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 cursor-pointer transition-all"
                >
                  <div>
                    <h4 className="font-medium text-gray-800">{result.scaleName}</h4>
                    <p className="text-sm text-gray-600">{result.completedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium" style={{ color: result.interpretation.color }}>
                      {result.interpretation.level}
                    </p>
                    <p className="text-sm text-gray-500">总分: {result.result.totalScore}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 测评页面
  const AssessmentPage = () => {
    const currentItem = currentScale.items[currentQuestion];
    const progress = ((currentQuestion + 1) / currentScale.items.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 py-8 max-w-3xl">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            {/* 头部 */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="flex items-center text-white/80 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  返回
                </button>
                <span className="text-white/90">
                  {currentQuestion + 1} / {currentScale.items.length}
                </span>
              </div>
              <h1 className="text-xl font-medium mb-2">{currentScale.name}</h1>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* 题目内容 */}
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-xl text-gray-800 mb-4 leading-relaxed">
                  {currentItem.text}
                </h2>
                {currentQuestion === 0 && (
                  <p className="text-gray-600">{currentScale.instructions}</p>
                )}
              </div>

              {/* 选项 */}
              <div className="space-y-3">
                {(currentScale.options || []).map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleResponse(option.value)}
                    className="w-full p-4 text-left bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center justify-between group"
                  >
                    <span className="text-gray-800 font-medium">{option.text}</span>
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-blue-400 transition-colors"
                      style={{ backgroundColor: responses[currentItem.id] === option.value ? option.color : 'transparent' }}
                    />
                  </button>
                ))}
              </div>

              {/* 导航 */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => {
                    if (currentQuestion > 0) {
                      setCurrentQuestion(currentQuestion - 1);
                    } else {
                      setCurrentPage('home');
                    }
                  }}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {currentQuestion > 0 ? '上一题' : '返回首页'}
                </button>
                <div className="text-sm text-gray-500 self-center">
                  轻松回答，没有对错之分
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 结果页面
  const ResultPage = () => {
    const scale = scales[currentResult.scaleId];
    
    // 准备图表数据
    const radarData = scale.dimensions.map(dim => ({
      dimension: dim.name,
      score: currentResult.result.dimensionScores[dim.name] || 0,
      fullMark: dim.items.length * Math.max(...scale.options.map(o => o.value))
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          {/* 结果概览 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-medium text-gray-800 mb-2">评估完成</h1>
              <p className="text-gray-600">{currentResult.scaleName} · {currentResult.completedAt}</p>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">总分</h3>
                  <p className="text-3xl font-bold text-blue-600">{currentResult.result.totalScore}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">评估结果</h3>
                  <p className="text-xl font-bold" style={{ color: currentResult.interpretation.color }}>
                    {currentResult.interpretation.level}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">完成进度</h3>
                  <p className="text-2xl font-bold text-green-600">100%</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-gray-700 text-center">
                <strong>温馨提示：</strong>{currentResult.interpretation.description}
              </p>
            </div>
          </div>

          {/* 详细分析 */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* 维度分析雷达图 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-blue-500" />
                维度分析
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis tick={false} />
                  <Radar
                    name="得分"
                    dataKey="score"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 维度详情 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                详细得分
              </h3>
              <div className="space-y-4">
                {scale.dimensions.map((dim, index) => {
                  const score = currentResult.result.dimensionScores[dim.name] || 0;
                  const maxScore = dim.items.length * Math.max(...scale.options.map(o => o.value));
                  const percentage = maxScore > 0 ? (score / maxScore * 100) : 0;
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">{dim.name}</span>
                        <span className="text-sm text-gray-600">{score}/{maxScore}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`, 
                            backgroundColor: dim.color 
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage('home')}
              className="px-8 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              返回首页
            </button>
            <button
              onClick={() => startAssessment(currentResult.scaleId)}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              重新测评
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'assessment' && <AssessmentPage />}
      {currentPage === 'result' && <ResultPage />}
    </div>
  );
};

export default PsychologyAssessmentWebsite;