import React from 'react';
import { Input, Select, Button } from '@/components/ui/';
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const MenuFilter = ({ 
  filterValues, 
  setFilterValues, 
  categories, 
  onFilter, 
  onClearFilter 
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Cooking Time Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cooking Time (minutes)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filterValues.cookingTimeMin}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  cookingTimeMin: e.target.value
                })}
                min="0"
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filterValues.cookingTimeMax}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  cookingTimeMax: e.target.value
                })}
                min="0"
                className="w-full"
              />
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <Select
              value={filterValues.difficulty}
              onValueChange={(value) => setFilterValues({
                ...filterValues,
                difficulty: value
              })}
            >
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Select difficulty" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Item value="">All</Select.Item>
                  <Select.Item value="easy">Easy</Select.Item>
                  <Select.Item value="medium">Medium</Select.Item>
                  <Select.Item value="hard">Hard</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select>
          </div>

          {/* Serving Size Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Serving Size</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filterValues.servingSizeMin}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  servingSizeMin: e.target.value
                })}
                min="1"
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filterValues.servingSizeMax}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  servingSizeMax: e.target.value
                })}
                min="1"
                className="w-full"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={filterValues.category}
              onValueChange={(value) => setFilterValues({
                ...filterValues,
                category: value
              })}
            >
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Select category" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Item value="">All</Select.Item>
                  {categories.map((category) => (
                    <Select.Item key={category._id} value={category._id}>
                      {category.name}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select>
          </div>

          {/* Calories Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Calories</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filterValues.caloriesMin}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  caloriesMin: e.target.value
                })}
                min="0"
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filterValues.caloriesMax}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  caloriesMax: e.target.value
                })}
                min="0"
                className="w-full"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-end gap-2">
            <Button 
              onClick={onFilter}
              className="w-full"
            >
              Filter
            </Button>
            <Button 
              variant="outline"
              onClick={onClearFilter}
              className="w-full"
            >
              Clear Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuFilter;