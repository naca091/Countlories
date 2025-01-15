import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MenuFilter = ({ filterValues, setFilterValues, categories, onFilter, onClearFilter }) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Total Cooking Time Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Cooking Time (minutes)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filterValues.totalCookingTimeMin}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  totalCookingTimeMin: e.target.value
                })}
                min="0"
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filterValues.totalCookingTimeMax}
                onChange={(e) => setFilterValues({
                  ...filterValues,
                  totalCookingTimeMax: e.target.value
                })}
                min="0"
                className="w-full"
              />
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty Level</label>
            <Select
              value={filterValues.difficulty}
              onValueChange={(value) => setFilterValues({
                ...filterValues,
                difficulty: value
              })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Serving Size Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Serving Size</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min servings"
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
                placeholder="Max servings"
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
              value={filterValues.categoryId}
              onValueChange={(value) => setFilterValues({
                ...filterValues,
                categoryId: value
              })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calories Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Calories</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min calories"
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
                placeholder="Max calories"
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
              Apply Filters
            </Button>
            <Button 
              variant="outline"
              onClick={onClearFilter}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuFilter;