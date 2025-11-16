"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = () => {
    // Mock data
    if (postId !== 'new') {
      setTitle('제주도 여행 후기');
      setContent('제주도 여행이 정말 좋았어요!\n\n첫 번째로 방문한 곳은...');
      setTags(['#제주도', '#여행']);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setLastSavedAt(new Date());
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const tagWithHash = newTag.startsWith('#') ? newTag : '#' + newTag;
      setTags([...tags, tagWithHash]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handlePublish = () => {
    router.push(`/publish/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <AppHeader
        title="편집"
        showBack
      />

      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <Button
          variant="primary"
          size="small"
          onClick={handleSave}
          loading={saving}
        >
          저장
        </Button>
      </div>

      <div className="screen-padding">
        {/* Title */}
        <div className="mb-4">
          <Input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold border-none focus:ring-0 px-0"
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <Textarea
            placeholder="내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className="border-none focus:ring-0 px-0"
          />
        </div>

        {/* AI Assistant */}
        <Card variant="outlined" className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            AI 어시스턴트
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <AssistButton icon="✨">문장 다듬기</AssistButton>
            <AssistButton icon="➕">문단 추가</AssistButton>
            <AssistButton icon="✓">맞춤법 검사</AssistButton>
            <AssistButton icon="🎨">표현 개선</AssistButton>
          </div>
        </Card>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            태그
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="+ 태그 추가"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button variant="outline" onClick={handleAddTag}>
              추가
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSave}
            className="flex-1"
          >
            임시저장
          </Button>
          <Button
            variant="primary"
            onClick={handlePublish}
            className="flex-1"
          >
            발행하기
          </Button>
        </div>

        {/* Save Status */}
        {lastSavedAt && (
          <p className="text-sm text-gray-500 text-center mt-4">
            마지막 저장: {lastSavedAt.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}

// AI Assist Button Component
interface AssistButtonProps {
  icon: string;
  children: React.ReactNode;
}

const AssistButton: React.FC<AssistButtonProps> = ({ icon, children }) => {
  return (
    <button className="px-3 py-2 border border-gray-200 rounded-md text-sm hover:border-primary-500 hover:bg-primary-50 transition-colors text-left">
      <span className="mr-1">{icon}</span>
      {children}
    </button>
  );
};
