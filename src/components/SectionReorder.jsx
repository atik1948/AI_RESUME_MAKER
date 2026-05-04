import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, section, index, moveUp, moveDown, sectionOrder, hasContent }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:border-neutral-700 cursor-move"
    >
      <div className="flex items-center">
        <div className="mr-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </div>
        <span className="text-gray-400 dark:text-gray-500 mr-3 font-mono text-sm min-w-[20px]">
          {index + 1}.
        </span>
        <div>
          <span className="font-medium text-gray-800 dark:text-gray-200">{section.name}</span>
          {section.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{section.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${hasContent ? 'bg-green-400' : 'bg-gray-300 dark:bg-neutral-600'}`} title={hasContent ? 'Has content' : 'No content'} />
        <button
          onClick={() => moveUp(index)}
          disabled={index === 0}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move up"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => moveDown(index)}
          disabled={index === sectionOrder.length - 1}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move down"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const SectionReorder = ({ sectionOrder, setSectionOrder, formData }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

const checkSectionHasContent = (sectionId) => {
    if (!formData) {
      console.log("formData is undefined or null");
      return false;
    }
    console.log("Checking content for section:", sectionId, "formData:", formData);
    switch (sectionId) {
      case 'contact':
        return !!(formData.fullName || formData.email || formData.phone);
      case 'summary':
        return !!(formData.summary && formData.summary.trim());
      case 'education':
        return !!(formData.education && formData.education.length > 0);
      case 'experiences':
        return !!(formData.experiences && formData.experiences.length > 0);
      case 'skills':
        return !!(formData.skills && formData.skills.length > 0);
      case 'projects':
        return !!(formData.projects && formData.projects.length > 0);
      default:
        return false;
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const moveSection = (fromIndex, toIndex) => {
    const newOrder = arrayMove(sectionOrder, fromIndex, toIndex);
    setSectionOrder(newOrder);
  };

  const moveUp = (index) => {
    if (index > 0) {
      moveSection(index, index - 1);
    }
  };

  const moveDown = (index) => {
    if (index < sectionOrder.length - 1) {
      moveSection(index, index + 1);
    }
  };

  if (!sectionOrder || sectionOrder.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No sections available to reorder.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Please complete the previous steps to add content sections.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">Customize Section Order</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        <span className="inline-flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          Drag and drop sections to reorder them, or use the arrow buttons.
        </span>
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionOrder.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {sectionOrder.map((section, index) => (
              <SortableItem
                key={section.id}
                id={section.id}
                section={section}
                index={index}
                moveUp={moveUp}
                moveDown={moveDown}
                sectionOrder={sectionOrder}
                hasContent={checkSectionHasContent(section.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Resume Section Order:
        </h3>
        <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
{sectionOrder.map((section, index) => (
  <li key={section.id} className="flex items-center">
    <span className="font-mono text-blue-500 dark:text-blue-400 mr-2 min-w-[20px]">
      {index + 1}.
    </span>
    <span>{section.name}</span>
    <div className={`ml-2 w-1.5 h-1.5 rounded-full ${
      checkSectionHasContent(section.id) ? 'bg-green-400' : 'bg-gray-300 dark:bg-neutral-600'
    }`} />
  </li>
))}
        </ol>
        
        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Green dots indicate sections with content
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionReorder;
