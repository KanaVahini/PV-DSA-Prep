// ============================================================
// DSA Arrays — Pattern Data
// Registers itself into window.TOPIC_REGISTRY["arrays"] so multiple
// topic files (data.arrays.js, data.linkedlist.js, ...) can coexist
// without clashing on global names.
// ============================================================
(function () {
const TOPIC = {
  id: "arrays",
  title: "Arrays",
  tagline: "Every array question is a disguise. Learn the pattern underneath, not the problem on top."
};

const PATTERNS = [
  {
    id: "array-basics",
    name: "Array Basics",
    color: "#a8c94a",
    icon: "array-basics",
    trigger: "The most straightforward single-pass scans — biggest value, is it sorted, does a run of consecutive things exist",
    summary: "Before any of the clever tricks, these are the questions that just want you to walk through the array once, tracking one or two things as you go. Simple, but worth having completely automatic.",
    problems: [
      {
        name: "Largest Element in an Array",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/find-maximum-minimum-element-array/",
        idea: "Walk through once, keeping track of the biggest value you've seen so far. Every new number either beats the current best (update it) or doesn't (ignore it) — there's no shortcut faster than looking at every element at least once.",
        time: "O(n)", space: "O(1)",
        code: `int largestElement(vector<int>& arr) {
    int best = arr[0];
    for (int x : arr) best = max(best, x);
    return best;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Second Largest Element in an Array",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/second-largest-element-in-array/",
        idea: "Sorting and picking index 1 works but does more work than needed. In a single pass, track both the largest and second-largest so far — whenever a new number beats the largest, the old largest slides down into second place before the new number takes over.",
        time: "O(n)", space: "O(1)",
        code: `int secondLargest(vector<int>& arr) {
    int first = INT_MIN, second = INT_MIN;
    for (int x : arr) {
        if (x > first) { second = first; first = x; }
        else if (x > second && x != first) second = x;
    }
    return second;
}`,
        variations: [],
        gotchas: ["Watch out for duplicates of the largest value — `x != first` stops a repeated maximum from being mistaken for the second largest."]
      },
      {
        name: "Linear Search",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/linear-search/",
        idea: "Check each element one at a time until you find a match or run out of array. There's no faster general-purpose way to search an unsorted array — this is the baseline every other search technique (binary search, hashing) is trying to beat.",
        time: "O(n)", space: "O(1)",
        code: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < (int)arr.size(); i++)
        if (arr[i] == target) return i;
    return -1;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Check if the Array Is Sorted (and Rotated)",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/",
        idea: "In a normal sorted array, every element is ≤ the one after it. A sorted-then-rotated array breaks that rule at exactly ONE point (the seam where it wraps around) — as long as that's the only break, and the last element isn't bigger than the first, it still counts as sorted-and-rotated. Count how many times the rule breaks; more than one break means it's neither sorted nor a valid rotation.",
        time: "O(n)", space: "O(1)",
        code: `bool checkSortedAndRotated(vector<int>& nums) {
    int breaks = 0;
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        if (nums[i] > nums[(i + 1) % n]) breaks++;
    }
    return breaks <= 1;
}`,
        variations: [],
        gotchas: ["Comparing the last element back to the first (using `% n`) is what correctly checks the 'wraparound seam' — don't just stop at the second-to-last element."]
      },
      {
        name: "Maximum Consecutive Ones",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/max-consecutive-ones/",
        idea: "Keep a running counter of the current streak of 1s, resetting it to zero the moment you hit a 0. Track the best streak seen so far as you go — no need for a window or two pointers, since a streak only ever grows one step at a time or resets completely.",
        time: "O(n)", space: "O(1)",
        code: `int findMaxConsecutiveOnes(vector<int>& nums) {
    int streak = 0, best = 0;
    for (int x : nums) {
        streak = (x == 1) ? streak + 1 : 0;
        best = max(best, streak);
    }
    return best;
}`,
        variations: ["Max Consecutive Ones III (allowed to flip up to k zeros — needs the sliding window pattern instead)"],
        gotchas: []
      }
    ]
  },
  {
    id: "in-place-manipulation",
    name: "In-Place Array Rearrangement",
    color: "#e857a0",
    icon: "in-place-manipulation",
    trigger: "Rewrite the array itself — remove/shift/rotate elements — without allocating a second array",
    summary: "These all share one constraint: rearrange the array using only the space it already has. That usually means a read pointer and a write pointer moving through the array at different speeds.",
    problems: [
      {
        name: "Remove Duplicates from Sorted Array",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        idea: "Because the array is sorted, every duplicate sits right next to its twin. Keep a 'write' pointer marking where the next unique value should go, and a 'read' pointer scanning ahead — whenever the read pointer finds a value different from what's at the write pointer, copy it forward and advance the write pointer.",
        time: "O(n)", space: "O(1)",
        code: `int removeDuplicates(vector<int>& nums) {
    int write = 1;
    for (int read = 1; read < (int)nums.size(); read++) {
        if (nums[read] != nums[write - 1]) {
            nums[write] = nums[read];
            write++;
        }
    }
    return write;
}`,
        variations: [],
        gotchas: ["The array only needs to be modified up to the returned length — LeetCode ignores whatever's left after that, so don't worry about 'cleaning up' the tail."]
      },
      {
        name: "Left Rotate the Array by One",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/array-rotation/",
        idea: "Save the first element off to the side, shift every other element one position to the left, then drop the saved value into the now-empty last spot.",
        time: "O(n)", space: "O(1)",
        code: `void leftRotateByOne(vector<int>& arr) {
    int first = arr[0];
    for (int i = 0; i < (int)arr.size() - 1; i++) arr[i] = arr[i + 1];
    arr[arr.size() - 1] = first;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Left Rotate the Array by K Places",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/rotate-array/",
        idea: "Doing 'rotate by one' k times works but wastes time. The neat O(n) trick: reverse the first k elements, reverse the rest, then reverse the WHOLE array. Each reversal is simple, and the three of them combined land every element exactly where a k-rotation would put it.",
        time: "O(n)", space: "O(1)",
        code: `void leftRotate(vector<int>& nums, int k) {
    int n = nums.size();
    k %= n;
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin() + k, nums.end());
    reverse(nums.begin(), nums.end());
}`,
        variations: [],
        gotchas: ["Always reduce k with `k % n` first — rotating by the full length (or a multiple of it) is a no-op, and skipping this wastes unnecessary work."]
      },
      {
        name: "Move Zeroes",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/move-zeroes/",
        idea: "Same read/write pointer idea as removing duplicates. The write pointer marks where the next non-zero value should land; scan through with the read pointer, and every time you find a non-zero, swap it into the write pointer's spot and advance. Zeroes naturally get pushed toward the end as a side effect.",
        time: "O(n)", space: "O(1)",
        code: `void moveZeroes(vector<int>& nums) {
    int write = 0;
    for (int read = 0; read < (int)nums.size(); read++) {
        if (nums[read] != 0) {
            swap(nums[write], nums[read]);
            write++;
        }
    }
}`,
        variations: [],
        gotchas: ["Swapping (not just overwriting) is what keeps the non-zero elements in their original relative order while pushing zeroes back."]
      },
      {
        name: "Union of Two Sorted Arrays",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/union-of-two-sorted-arrays/",
        idea: "This is the merge step of merge sort, with one twist: skip duplicates. Walk two pointers through both sorted arrays at once, always taking the smaller of the two current values — and only add it to the result if it's different from the last value you added.",
        time: "O(m+n)", space: "O(m+n) for the result",
        code: `vector<int> unionArray(vector<int>& a, vector<int>& b) {
    vector<int> result;
    int i = 0, j = 0;
    while (i < (int)a.size() && j < (int)b.size()) {
        int smaller = (a[i] <= b[j]) ? a[i] : b[j];
        if (result.empty() || result.back() != smaller) result.push_back(smaller);
        (a[i] <= b[j]) ? i++ : j++;
    }
    while (i < (int)a.size()) { if (result.empty() || result.back() != a[i]) result.push_back(a[i]); i++; }
    while (j < (int)b.size()) { if (result.empty() || result.back() != b[j]) result.push_back(b[j]); j++; }
    return result;
}`,
        variations: [],
        gotchas: ["Don't forget the two cleanup loops at the end — once one array runs out, the other one's remaining elements still need to be merged in."]
      }
    ]
  },
  {
    id: "two-pointers",
    name: "Two Pointers",
    color: "#5b8def",
    icon: "two-pointers",
    trigger: "Sorted array + find a pair · \"reverse in place\" · \"remove duplicates in place\" · palindrome check",
    summary: "Two positions move toward each other (or together) so you only go through the array once, instead of comparing every pair.",
    problems: [
      {
        name: "Two Sum II (sorted array)",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
        idea: "Since the array is sorted, you don't have to check every pair one by one. Put one finger at the start and one at the end. If the two numbers add up to less than the target, the only way to get a bigger sum is to move the left finger forward. If it's too big, move the right finger back. You're never wasting a check.",
        time: "O(n)", space: "O(1)",
        code: `vector<int> twoSum(vector<int>& numbers, int target) {
    int l = 0, r = numbers.size() - 1;
    while (l < r) {
        int sum = numbers[l] + numbers[r];
        if (sum == target) return {l, r};
        sum < target ? l++ : r--;
    }
    return {};
}`,
        variations: ["3Sum / 4Sum (fix outer index, two-pointer the rest)", "Two sum closest to target"],
        gotchas: ["This trick only works because the array is sorted — sort it first if it isn't (adds extra time)."]
      },
      {
        name: "3Sum",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/3sum/",
        idea: "Sort the array first. Then pick one number at a time to be 'the first number', and use the two-pointer trick from Two Sum on the rest of the array to find two more numbers that cancel it out to zero. So a 3-number problem turns into a bunch of 2-number problems you already know how to solve.",
        time: "O(n²)", space: "O(1) extra (excl. output)",
        code: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    for (int i = 0; i < (int)nums.size() - 2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue; // skip dupes
        int l = i + 1, r = nums.size() - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum == 0) {
                res.push_back({nums[i], nums[l], nums[r]});
                l++; r--;
                while (l < r && nums[l] == nums[l-1]) l++;
            }
            else sum < 0 ? l++ : r--;
        }
    }
    return res;
}`,
        variations: ["3Sum Closest", "4Sum (one more fixed loop)"],
        gotchas: ["Skipping repeated numbers is the part people forget — do it for all three positions, not just the first."]
      },
      {
        name: "4Sum",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/4sum/",
        idea: "Same trick as 3Sum, just with one more layer: fix TWO numbers with nested loops instead of one, then run the two-pointer sweep on whatever's left. The extra fixed loop is what pushes the time complexity up a notch, but the core technique — sort, fix, two-pointer — doesn't change at all.",
        time: "O(n³)", space: "O(1) extra (excl. output)",
        code: `vector<vector<int>> fourSum(vector<int>& nums, int target) {
    sort(nums.begin(), nums.end());
    int n = nums.size();
    vector<vector<int>> res;
    for (int i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        for (int j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] == nums[j-1]) continue;
            int l = j + 1, r = n - 1;
            while (l < r) {
                long sum = (long)nums[i] + nums[j] + nums[l] + nums[r];
                if (sum == target) {
                    res.push_back({nums[i], nums[j], nums[l], nums[r]});
                    l++; r--;
                    while (l < r && nums[l] == nums[l-1]) l++;
                    while (l < r && nums[r] == nums[r+1]) r--;
                } else if (sum < target) l++;
                else r--;
            }
        }
    }
    return res;
}`,
        variations: [],
        gotchas: ["Use a wider type (like `long`) for the running sum — four `int`s added together can overflow a 32-bit int on the boundary test cases."]
      },
      {
        name: "Container With Most Water",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/container-with-most-water/",
        idea: "Start with the two walls farthest apart — that gives you the most width to work with, even if one wall is short. The water level is always limited by whichever wall is shorter. So moving the taller wall inward can't possibly help (width shrinks, height stays capped by the short one) — only moving the shorter wall has a chance of finding something better.",
        time: "O(n)", space: "O(1)",
        code: `int maxArea(vector<int>& height) {
    int l = 0, r = height.size() - 1, best = 0;
    while (l < r) {
        best = max(best, min(height[l], height[r]) * (r - l));
        height[l] < height[r] ? l++ : r--;
    }
    return best;
}`,
        variations: ["Trapping Rain Water (needs prefix max on both sides too)"],
        gotchas: ["Try to explain to yourself why you always move the shorter wall — interviewers love asking this as a follow-up."]
      },
      {
        name: "Sort Colors (Dutch flag)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/sort-colors/",
        idea: "Instead of actually sorting, split the array into three zones as you go: 0s at the front, 2s at the back, and 1s left in the middle. Keep three markers — one for where the next 0 should go, one for the number you're currently looking at, and one for where the next 2 should go. Swap numbers into the right zone as you scan through once.",
        time: "O(n)", space: "O(1)",
        code: `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) swap(nums[low++], nums[mid++]);
        else if (nums[mid] == 1) mid++;
        else swap(nums[mid], nums[high--]);
    }
}`,
        variations: ["Move Zeroes", "Segregate even/odd"],
        gotchas: ["When you swap a 2 to the back, don't move your 'current' marker forward yet — you haven't looked at the new number that just landed there."]
      },
      {
        name: "Valid Palindrome (array/string)",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/valid-palindrome/",
        idea: "A palindrome reads the same from both ends. So just compare the first and last character, then the second and second-to-last, and keep moving inward. The moment two characters don't match, you can stop — it's not a palindrome.",
        time: "O(n)", space: "O(1)",
        code: `bool isPalindrome(string s) {
    int l = 0, r = s.size() - 1;
    while (l < r) {
        if (s[l] != s[r]) return false;
        l++; r--;
    }
    return true;
}`,
        variations: ["Valid Palindrome II (allow one deletion)"],
        gotchas: []
      }
    ]
  },

  {
    id: "sliding-window",
    name: "Sliding Window",
    color: "#f2994a",
    icon: "sliding-window",
    trigger: "\"Contiguous subarray/substring\" + a size k, or a max/min/longest/shortest under some rule",
    summary: "Keep a 'window' over part of the array. Grow it on the right, shrink it on the left when needed — so you never re-scan the same numbers twice.",
    problems: [
      {
        name: "Maximum Sum Subarray of Size K",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/window-sliding-technique/",
        idea: "The slow way re-adds every number in the window each time it moves. Instead, just keep a running total: when the window slides over by one, add the new number that entered and subtract the one that just left. That's it — no need to re-add everything from scratch.",
        time: "O(n)", space: "O(1)",
        code: `int maxSumSubarray(vector<int>& arr, int k) {
    int windowSum = 0, best = INT_MIN;
    for (int r = 0; r < (int)arr.size(); r++) {
        windowSum += arr[r];
        if (r >= k - 1) {
            best = max(best, windowSum);
            windowSum -= arr[r - k + 1];
        }
    }
    return best;
}`,
        variations: ["Average of subarrays of size k"],
        gotchas: ["This is a fixed-size window: exactly one number comes in and one goes out at every step."]
      },
      {
        name: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        idea: "Grow the window to the right, and remember the last position you saw each character. If you hit a character that's already inside your current window, jump the left edge straight past where you last saw it — don't shrink one step at a time, just jump directly there. That's what keeps this fast.",
        time: "O(n)", space: "O(min(n, charset))",
        code: `int lengthOfLongestSubstring(string s) {
    unordered_map<char,int> seen;
    int l = 0, best = 0;
    for (int r = 0; r < (int)s.size(); r++) {
        if (seen.count(s[r]) && seen[s[r]] >= l) l = seen[s[r]] + 1;
        seen[s[r]] = r;
        best = max(best, r - l + 1);
    }
    return best;
}`,
        variations: ["Longest substring with at most K distinct characters", "Longest repeating character replacement"],
        gotchas: ["Jump straight to 'last seen position + 1' — shrinking one step at a time is the slow, wrong way to do this."]
      },
      {
        name: "Minimum Size Subarray Sum",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/minimum-size-subarray-sum/",
        idea: "This time you want the smallest window that still works, not the biggest. Grow the window until its sum finally reaches the target. Then, since you want it small, shrink from the left as much as you can while it's still valid, and remember the smallest size you managed.",
        time: "O(n)", space: "O(1)",
        code: `int minSubArrayLen(int target, vector<int>& nums) {
    int l = 0, sum = 0, best = INT_MAX;
    for (int r = 0; r < (int)nums.size(); r++) {
        sum += nums[r];
        while (sum >= target) {
            best = min(best, r - l + 1);
            sum -= nums[l++];
        }
    }
    return best == INT_MAX ? 0 : best;
}`,
        variations: ["Subarray Product Less Than K"],
        gotchas: ["Use a `while` loop for the shrinking step, not an `if` — you may need to shrink several times in a row."]
      },
      {
        name: "Longest Substring with At Most K Distinct Characters",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/",
        idea: "Keep a count of how many times each character appears inside your current window. Grow the window to the right. The moment you have more than k different characters, shrink from the left — removing characters from your count — until you're back down to k or fewer.",
        time: "O(n)", space: "O(k)",
        code: `int longestKDistinct(string s, int k) {
    unordered_map<char,int> freq;
    int l = 0, best = 0;
    for (int r = 0; r < (int)s.size(); r++) {
        freq[s[r]]++;
        while ((int)freq.size() > k) {
            freq[s[l]]--;
            if (freq[s[l]] == 0) freq.erase(s[l]);
            l++;
        }
        best = max(best, r - l + 1);
    }
    return best;
}`,
        variations: ["Fruit Into Baskets (same problem, K=2)"],
        gotchas: []
      },
      {
        name: "Max Consecutive Ones III",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/max-consecutive-ones-iii/",
        idea: "You're allowed to flip up to k zeros into ones. So think of it as: a window is allowed to contain at most k zeros. Grow the window freely, and whenever it has more than k zeros inside, shrink from the left until it's back to k or fewer.",
        time: "O(n)", space: "O(1)",
        code: `int longestOnes(vector<int>& nums, int k) {
    int l = 0, zeros = 0, best = 0;
    for (int r = 0; r < (int)nums.size(); r++) {
        if (nums[r] == 0) zeros++;
        while (zeros > k) { if (nums[l] == 0) zeros--; l++; }
        best = max(best, r - l + 1);
    }
    return best;
}`,
        variations: [],
        gotchas: ["This is the exact same shape as the 'at most K distinct characters' problem above — just spot the pattern, not the story."]
      },
      {
        name: "Longest Subarray with Sum K (positives only)",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/longest-sub-array-sum-k/",
        idea: "Because every number is positive, growing the window can only ever increase the sum, and shrinking it can only ever decrease it — the sum moves in one predictable direction. That predictability is exactly what a sliding window needs: grow the window while the sum is too small, shrink it while the sum is too big, and record the window length whenever the sum matches exactly.",
        time: "O(n)", space: "O(1)",
        code: `int longestSubarraySumK(vector<int>& arr, int k) {
    int l = 0, sum = 0, best = 0;
    for (int r = 0; r < (int)arr.size(); r++) {
        sum += arr[r];
        while (sum > k) sum -= arr[l++];
        if (sum == k) best = max(best, r - l + 1);
    }
    return best;
}`,
        variations: ["Longest Subarray with Sum K (negatives allowed) — the sliding window trick breaks once negatives are involved, since shrinking no longer guarantees the sum goes down; that variant needs the prefix-sum + hashmap pattern instead"],
        gotchas: ["This exact approach silently gives wrong answers the moment the array can contain negative numbers — always check the constraints before reaching for a sliding window."]
      }
    ]
  },

  {
    id: "prefix-sum",
    name: "Prefix Sum / Suffix Sum",
    color: "#9b6bf2",
    icon: "prefix-sum",
    trigger: "Answering many 'sum of this range' questions · \"subarray sum equals X\" · need product/sum of everything except one number",
    summary: "Do the adding once, upfront. Then any range sum becomes a single subtraction instead of re-adding numbers every time you're asked.",
    problems: [
      {
        name: "Range Sum Query - Immutable",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/range-sum-query-immutable/",
        idea: "If you're going to be asked 'what's the sum from here to there?' again and again, don't re-add the numbers every single time. Build one running-total array upfront. After that, the sum of any range is just one subtraction: total up to the end, minus total up to just before the start.",
        time: "O(1) per question after building it once", space: "O(n)",
        code: `class NumArray {
    vector<int> prefix;
public:
    NumArray(vector<int>& nums) {
        prefix.assign(nums.size() + 1, 0);
        for (int i = 0; i < (int)nums.size(); i++) prefix[i+1] = prefix[i] + nums[i];
    }
    int sumRange(int l, int r) {
        return prefix[r+1] - prefix[l];
    }
};`,
        variations: ["Range Sum Query 2D (same idea, but for a grid)"],
        gotchas: ["Start the running-total array with a 0 at the front — it saves you from special-casing the very first range."]
      },
      {
        name: "Subarray Sum Equals K",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/subarray-sum-equals-k/",
        idea: "A stretch of numbers sums to k exactly when: (running total right now) minus (running total earlier) equals k. So as you scan and keep a running total, ask a hashmap: 'have I seen a running total of (current total minus k) before?' Every time yes, that's one more valid stretch ending here.",
        time: "O(n)", space: "O(n)",
        code: `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> seen;
    seen[0] = 1;
    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;
        if (seen.count(sum - k)) count += seen[sum - k];
        seen[sum]++;
    }
    return count;
}`,
        variations: ["Continuous Subarray Sum (divisible by k)", "Subarray sums divisible by K"],
        gotchas: ["Start the map with {0: 1} — this accounts for a stretch that starts right from the beginning of the array."]
      },
      {
        name: "Product of Array Except Self",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/product-of-array-except-self/",
        idea: "'Everything except me' is really just 'everything to my left' times 'everything to my right'. Walk left to right, keeping a running product of everything before each spot. Then walk right to left doing the same thing for everything after each spot, multiplying both together. No division involved, so it even works if the array has a zero in it.",
        time: "O(n)", space: "O(1) extra (not counting the output)",
        code: `vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n, 1);
    int prefix = 1;
    for (int i = 0; i < n; i++) { res[i] = prefix; prefix *= nums[i]; }
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) { res[i] *= suffix; suffix *= nums[i]; }
    return res;
}`,
        variations: [],
        gotchas: ["The whole point of this question is doing it without division — make sure you can explain why division would be risky (zeros!)."]
      },
      {
        name: "Find Pivot Index",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/find-pivot-index/",
        idea: "You're looking for a spot where everything to the left adds up to the same as everything to the right. Add up the whole array once. Then walk left to right, keeping a running left-side total — the right-side total at any point is just (whole array total) minus (left total) minus (the current number).",
        time: "O(n)", space: "O(1)",
        code: `int pivotIndex(vector<int>& nums) {
    int total = 0;
    for (int x : nums) total += x;
    int leftSum = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (leftSum == total - leftSum - nums[i]) return i;
        leftSum += nums[i];
    }
    return -1;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Longest Subarray with Sum K (negatives allowed)",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/longest-sub-array-sum-k/",
        idea: "A stretch summing to k means: (running total now) minus (running total earlier) equals k — so (running total earlier) equals (running total now) minus k. As you scan, keep a hashmap of the FIRST index each running total was ever seen at. If (current total - k) has been seen before, the stretch from just after that first occurrence to right here sums to k — and using the first occurrence (not just any occurrence) is what guarantees you get the LONGEST such stretch.",
        time: "O(n)", space: "O(n)",
        code: `int longestSubarraySumK(vector<int>& arr, int k) {
    unordered_map<int,int> firstSeen; // prefix sum -> earliest index it was seen at
    long sum = 0;
    int best = 0;
    for (int i = 0; i < (int)arr.size(); i++) {
        sum += arr[i];
        if (sum == k) best = max(best, i + 1);
        if (firstSeen.count(sum - k)) best = max(best, i - firstSeen[sum - k]);
        if (!firstSeen.count(sum)) firstSeen[sum] = i;
    }
    return best;
}`,
        variations: ["If all values are guaranteed positive, the sliding window version is simpler and uses O(1) space instead."],
        gotchas: ["Only store the FIRST time each prefix sum appears — overwriting it with a later index would shrink the window instead of maximizing it."]
      },
      {
        name: "Largest Subarray with Sum 0",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/largest-subarray-with-0-sum/",
        idea: "This is the k=0 special case of the problem above: a subarray sums to zero exactly when the running total repeats a value it's had before. Track the first index each running total appears at; any time you see a repeat, the stretch in between sums to zero.",
        time: "O(n)", space: "O(n)",
        code: `int maxLenZeroSum(vector<int>& arr) {
    unordered_map<int,int> firstSeen;
    firstSeen[0] = -1; // sum of 0 "seen" before the array even starts
    long sum = 0;
    int best = 0;
    for (int i = 0; i < (int)arr.size(); i++) {
        sum += arr[i];
        if (firstSeen.count(sum)) best = max(best, i - firstSeen[sum]);
        else firstSeen[sum] = i;
    }
    return best;
}`,
        variations: [],
        gotchas: ["Seed the map with `{0: -1}` — that accounts for a zero-sum subarray that starts right at index 0."]
      },
      {
        name: "Count Subarrays with Given XOR K",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/count-subarrays-given-xor-k/",
        idea: "This is 'Subarray Sum Equals K', but every '+' is replaced with 'XOR'. A subarray XORs to k exactly when (running XOR now) XOR (running XOR earlier) equals k — which rearranges to (running XOR earlier) equals (running XOR now) XOR k, since XOR undoes itself. Keep a hashmap counting how many times each running XOR value has appeared, and add to your count whenever (current XOR) XOR k has been seen before.",
        time: "O(n)", space: "O(n)",
        code: `int countSubarraysXorK(vector<int>& arr, int k) {
    unordered_map<int,int> freq;
    freq[0] = 1;
    int xorSum = 0, count = 0;
    for (int x : arr) {
        xorSum ^= x;
        if (freq.count(xorSum ^ k)) count += freq[xorSum ^ k];
        freq[xorSum]++;
    }
    return count;
}`,
        variations: [],
        gotchas: ["Seed the map with `{0: 1}` just like Subarray Sum Equals K — it accounts for a subarray starting at index 0 whose XOR already equals k."]
      },
      {
        name: "Leaders in an Array",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/leaders-in-an-array/",
        idea: "A 'leader' is an element that's bigger than everything to its right. Instead of checking every element against everything after it, scan from the RIGHT end, keeping a running maximum — any element that beats the running maximum-so-far is a leader, since by definition nothing after it (which you've already scanned) is bigger.",
        time: "O(n)", space: "O(1) extra (excl. output)",
        code: `vector<int> leaders(vector<int>& arr) {
    vector<int> result;
    int maxFromRight = INT_MIN;
    for (int i = arr.size() - 1; i >= 0; i--) {
        if (arr[i] > maxFromRight) {
            result.push_back(arr[i]);
            maxFromRight = arr[i];
        }
    }
    reverse(result.begin(), result.end()); // restore original left-to-right order
    return result;
}`,
        variations: [],
        gotchas: ["The rightmost element is always a leader by definition (nothing after it to beat it) — a right-to-left scan naturally handles this without a special case."]
      }
    ]
  },

  {
    id: "kadane",
    name: "Kadane's Algorithm",
    color: "#f2597a",
    icon: "kadane",
    trigger: "\"Maximum or minimum sum (or product) of a contiguous stretch of numbers\"",
    summary: "At each number, ask one simple question: does adding me to what came before make things better, or should I just start over from here?",
    problems: [
      {
        name: "Maximum Subarray",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/maximum-subarray/",
        idea: "At every number, you only have one real choice: keep building on the stretch you already have, or throw it away and start fresh from this number. If your running total has gone negative, it's only dragging you down — it's always better to drop it and restart. Making that one small choice at every step, over and over, ends up finding the best answer overall.",
        time: "O(n)", space: "O(1)",
        code: `int maxSubArray(vector<int>& nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        cur = max(nums[i], cur + nums[i]);
        best = max(best, cur);
    }
    return best;
}`,
        variations: ["Maximum Circular Subarray Sum (total minus the minimum subarray, with a special case for all-negative arrays)"],
        gotchas: ["This already handles negative numbers correctly on its own — no extra work needed unless it's the circular version."]
      },
      {
        name: "Maximum Product Subarray",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/maximum-product-subarray/",
        idea: "With sums, bigger running totals are always safer. But with products, a very negative number times another negative number suddenly becomes a big positive number! So you have to track both the biggest AND the smallest running product at every step — because the smallest one might flip into the biggest one on the very next step.",
        time: "O(n)", space: "O(1)",
        code: `int maxProduct(vector<int>& nums) {
    int maxP = nums[0], minP = nums[0], best = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        if (nums[i] < 0) swap(maxP, minP);
        maxP = max(nums[i], maxP * nums[i]);
        minP = min(nums[i], minP * nums[i]);
        best = max(best, maxP);
    }
    return best;
}`,
        variations: [],
        gotchas: ["Tracking the minimum alongside the maximum is the entire trick here — that's what makes this different from plain Kadane."]
      },
      {
        name: "Maximum Circular Subarray Sum",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/maximum-sum-circular-subarray/",
        idea: "There are only two possibilities: either the best stretch doesn't wrap around the end of the array (plain Kadane finds it), or it does wrap around — which is the same as taking everything except the worst middle stretch (total sum minus the minimum subarray). Compute both and take whichever is bigger.",
        time: "O(n)", space: "O(1)",
        code: `// maxKadane and minKadane computed normally (standard Kadane's for max, and the mirrored
// version tracking a running minimum for min)
// if every element is negative: answer = maxKadane
// otherwise: answer = max(maxKadane, total - minKadane)`,
        variations: [],
        gotchas: ["If every number is negative, the 'total minus minimum' trick breaks (it gives an empty array) — handle that case separately."]
      },
      {
        name: "Best Time to Buy and Sell Stock",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        idea: "This has the same spirit as Kadane's — track the best-so-far as you scan once. Keep a running minimum price seen so far (the cheapest day to have bought), and at every day, check what profit you'd make selling today against that running minimum. There's no need to check every buy/sell pair — the best buy day is always just the lowest price you've seen up to today.",
        time: "O(n)", space: "O(1)",
        code: `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX, best = 0;
    for (int p : prices) {
        minPrice = min(minPrice, p);
        best = max(best, p - minPrice);
    }
    return best;
}`,
        variations: [],
        gotchas: ["Update `minPrice` before computing the profit for the current day — you can't sell and buy on the same day in this version of the problem."]
      },
      {
        name: "Print Subarray with Maximum Sum",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/find-subarray-with-given-sum-in-array-set-1-nonnegative-numbers/",
        idea: "Same running logic as Kadane's, but now you also need to remember WHERE the best subarray started and ended, not just its sum. Track a tentative start index that resets every time you restart the running sum from scratch, and whenever the running sum beats the best-so-far, snapshot the current start and end as the new answer.",
        time: "O(n)", space: "O(1) extra (excl. output)",
        code: `vector<int> maxSumSubarrayIndices(vector<int>& arr) {
    int cur = arr[0], best = arr[0];
    int tentativeStart = 0, bestStart = 0, bestEnd = 0;
    for (int i = 1; i < (int)arr.size(); i++) {
        if (arr[i] > cur + arr[i]) { cur = arr[i]; tentativeStart = i; }
        else cur = cur + arr[i];
        if (cur > best) { best = cur; bestStart = tentativeStart; bestEnd = i; }
    }
    return {bestStart, bestEnd, best};
}`,
        variations: [],
        gotchas: ["The tentative start only updates when you actually restart the running sum — don't move it on every iteration, or you'll lose track of where the best stretch really began."]
      }
    ]
  },

  {
    id: "binary-search",
    name: "Binary Search on Arrays",
    color: "#4fb0e0",
    icon: "binary-search",
    trigger: "Sorted (or rotated-sorted) array · \"find it fast\" · \"find the smallest/largest value that still works\" (binary search on the answer)",
    summary: "Cut the search space in half every time. Also works beyond just finding a number — it can find the best value that satisfies some condition.",
    problems: [
      {
        name: "Binary Search (classic)",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/binary-search/",
        idea: "Because the array is sorted, you never need to check every single number. Look at the middle one — if your target is bigger, it must be in the right half; if smaller, it's in the left half. Either way, you just threw away half the array without even checking it. Keep doing that until you find it.",
        time: "O(log n)", space: "O(1)",
        code: `int search(vector<int>& nums, int target) {
    int l = 0, r = nums.size() - 1;
    while (l <= r) {
        int m = l + ((r - l) >> 1);
        if (nums[m] == target) return m;
        nums[m] < target ? l = m + 1 : r = m - 1;
    }
    return -1;
}`,
        variations: ["Finding the first or last position of a value in a sorted array"],
        gotchas: ["Writing `l + (r-l)/2` instead of `(l+r)/2` avoids an integer overflow bug when l and r are both large — good habit to default to."]
      },
      {
        name: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        idea: "A rotated sorted array looks messy, but here's the trick: no matter where you split it in half, at least ONE of the two halves is still perfectly sorted. So check which half is sorted, see if your target could be hiding in that sorted half, and search there. Otherwise, search the other half.",
        time: "O(log n)", space: "O(1)",
        code: `int search(vector<int>& nums, int target) {
    int l = 0, r = nums.size() - 1;
    while (l <= r) {
        int m = (l + r) >> 1;
        if (nums[m] == target) return m;
        if (nums[l] <= nums[m]) { // left half sorted
            if (nums[l] <= target && target < nums[m]) r = m - 1; else l = m + 1;
        } else { // right half sorted
            if (nums[m] < target && target <= nums[r]) l = m + 1; else r = m - 1;
        }
    }
    return -1;
}`,
        variations: ["Same problem but with duplicate numbers allowed", "Find the smallest number in a rotated sorted array"],
        gotchas: ["If there are duplicate numbers at both ends, you sometimes can't tell which half is sorted — just shrink both ends by one and try again."]
      },
      {
        name: "Find Minimum in Rotated Sorted Array",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        idea: "The smallest number is sitting exactly where the sorted order 'breaks'. Compare the middle number to the rightmost one: if the middle is bigger, the break (and the minimum) must be somewhere to its right. Otherwise, the minimum is the middle number itself or somewhere to its left.",
        time: "O(log n)", space: "O(1)",
        code: `int findMin(vector<int>& nums) {
    int l = 0, r = nums.size() - 1;
    while (l < r) {
        int m = (l + r) >> 1;
        nums[m] > nums[r] ? l = m + 1 : r = m;
    }
    return nums[l];
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Koko Eating Bananas (binary search on the answer)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/koko-eating-bananas/",
        idea: "This is a different way to use binary search — not to find a number in the array, but to find the best possible ANSWER to a question. Notice that eating faster always means finishing in fewer-or-equal hours — that's a predictable, one-direction relationship. So guess a speed, check if it's fast enough, and binary search on the guess itself until you find the slowest speed that still works.",
        time: "O(n log(biggest pile))", space: "O(1)",
        code: `int minEatingSpeed(vector<int>& piles, int h) {
    int l = 1, r = *max_element(piles.begin(), piles.end());
    while (l < r) {
        int m = (l + r) >> 1;
        long hours = 0;
        for (int p : piles) hours += (p + m - 1) / m; // ceil(p / m)
        hours <= h ? r = m : l = m + 1;
    }
    return l;
}`,
        variations: ["Capacity To Ship Packages Within D Days", "Split Array Largest Sum", "Minimum Days to Make M Bouquets"],
        gotchas: ["Once you recognize this shape — 'find the smallest number that still works' — you'll start seeing it everywhere in medium/hard problems."]
      }
    ]
  },

  {
    id: "hashing",
    name: "Hashing / Frequency Counting",
    color: "#2fbf9f",
    icon: "hashing",
    trigger: "\"Have I seen this before?\" · counting how often something appears · finding pairs/duplicates faster than checking every pair",
    summary: "Keep a lookup table (hashmap or set) so 'have I seen this before?' becomes an instant check instead of scanning the whole array again.",
    problems: [
      {
        name: "Two Sum",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/two-sum/",
        idea: "You don't need to check every possible pair of numbers. You just need to ask, for each number: 'have I already seen the number that would complete this pair?' A hashmap answers that instantly. So walk through once, and before adding the current number to your map, check if its 'partner' is already there.",
        time: "O(n)", space: "O(n)",
        code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int,int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
        variations: ["Two Sum II (if the array is sorted, use two pointers instead — no extra space needed)"],
        gotchas: ["Check for the partner BEFORE adding the current number — otherwise you might accidentally pair a number with itself."]
      },
      {
        name: "Majority Element",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/majority-element/",
        idea: "A frequency hashmap works fine, but there's a neat trick: since this number shows up more than everything else combined, think of matching numbers as +1 votes and everything else as -1 votes. Keep a running candidate and a vote count; when the count hits zero, switch to a new candidate. Whoever survives at the end is the answer.",
        time: "O(n)", space: "O(n) with a hashmap, or O(1) with the voting trick",
        code: `int majorityElement(vector<int>& nums) {
    int count = 0, candidate = 0;
    for (int x : nums) {
        if (count == 0) candidate = x;
        count += (x == candidate) ? 1 : -1;
    }
    return candidate;
}`,
        variations: ["Majority Element II (numbers appearing more than n/3 times)"],
        gotchas: ["The voting trick only works because the problem guarantees a majority number actually exists."]
      },
      {
        name: "Longest Consecutive Sequence",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-consecutive-sequence/",
        idea: "Put every number in a set for instant lookups. To avoid counting the same sequence multiple times, only start counting from a number that looks like the START of a sequence — meaning (number - 1) is NOT in the set. From there, keep checking number+1, number+2, and so on for as long as they exist.",
        time: "O(n)", space: "O(n)",
        code: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int best = 0;
    for (int x : numSet) {
        if (!numSet.count(x - 1)) {
            int len = 1;
            while (numSet.count(x + len)) len++;
            best = max(best, len);
        }
    }
    return best;
}`,
        variations: [],
        gotchas: ["Only starting from sequence beginnings is what keeps this fast — without that check, you'd re-count the same sequence over and over."]
      },
      {
        name: "Group Anagrams",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/group-anagrams/",
        idea: "Two words are anagrams when they have exactly the same letters, just shuffled. So if you sort the letters of any word alphabetically, anagrams become IDENTICAL strings. Use that sorted string as a hashmap key — every word with the same key belongs in the same group.",
        time: "O(n · k log k)", space: "O(n·k)",
        code: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    for (string& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        groups[key].push_back(s);
    }
    vector<vector<string>> res;
    for (auto& [key, group] : groups) res.push_back(group);
    return res;
}`,
        variations: [],
        gotchas: ["For very long words, counting each letter (instead of sorting) is a bit faster."]
      },
      {
        name: "Contains Duplicate II",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/contains-duplicate-ii/",
        idea: "You need to know two things: is this a repeat, and is it close enough (within k spots)? Keep a hashmap of each number's last-seen position. If you see the number again and the gap between positions is k or less, you're done.",
        time: "O(n)", space: "O(n)",
        code: `bool containsNearbyDuplicate(vector<int>& nums, int k) {
    unordered_map<int,int> last;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (last.count(nums[i]) && i - last[nums[i]] <= k) return true;
        last[nums[i]] = i;
    }
    return false;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Majority Element II",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/majority-element-ii/",
        idea: "At most TWO numbers can appear more than n/3 times (three such numbers would need over n elements total, which doesn't fit). So extend the Boyer-Moore voting trick from regular Majority Element to track two candidates and two counts at once, each candidate cancelling out against anything that isn't itself or the other candidate. A final verification pass confirms both candidates actually appear more than n/3 times, since the voting process can produce false positives if no such majority actually exists.",
        time: "O(n)", space: "O(1)",
        code: `vector<int> majorityElementII(vector<int>& nums) {
    int cand1 = 0, cand2 = 1, count1 = 0, count2 = 0; // cand1 != cand2 initially
    for (int x : nums) {
        if (x == cand1) count1++;
        else if (x == cand2) count2++;
        else if (count1 == 0) { cand1 = x; count1 = 1; }
        else if (count2 == 0) { cand2 = x; count2 = 1; }
        else { count1--; count2--; }
    }
    count1 = count2 = 0;
    for (int x : nums) { if (x == cand1) count1++; else if (x == cand2) count2++; }
    vector<int> res;
    if (count1 > (int)nums.size() / 3) res.push_back(cand1);
    if (count2 > (int)nums.size() / 3) res.push_back(cand2);
    return res;
}`,
        variations: [],
        gotchas: ["The verification pass at the end is mandatory here — unlike the n/2 version, the problem doesn't guarantee a valid answer exists, so the voting phase alone can hand you a wrong candidate."]
      }
    ]
  },

  {
    id: "cyclic-sort",
    name: "Cyclic Sort",
    color: "#e0b23f",
    icon: "cyclic-sort",
    trigger: "Numbers in the array are between 1 and n (or 0 and n-1) · \"find the missing or duplicate number\" without using extra space",
    summary: "Since every number has a 'home' spot based on its value, you can swap each number into its home in one pass — no sorting algorithm and no extra space needed.",
    problems: [
      {
        name: "Missing Number",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/missing-number/",
        idea: "Since the numbers are limited to a known range, each one has an exact spot it 'belongs' at. Walk through and swap each number into its home spot. Once that's done, whichever spot doesn't have the right number sitting in it tells you what's missing. (There's also a simple 'add up the numbers and compare' shortcut, but this swapping idea is what you'll need for the harder versions below.)",
        time: "O(n)", space: "O(1)",
        code: `int missingNumber(vector<int>& nums) {
    int n = nums.size(), i = 0;
    while (i < n) {
        int correct = nums[i];
        if (correct < n && nums[i] != nums[correct]) swap(nums[i], nums[correct]);
        else i++;
    }
    for (i = 0; i < n; i++) if (nums[i] != i) return i;
    return n;
}`,
        variations: [],
        gotchas: ["The sum shortcut (expected total minus actual total) is quicker to write but doesn't help you solve the trickier variants below."]
      },
      {
        name: "Find All Duplicates in an Array",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/find-all-duplicates-in-an-array/",
        idea: "Same 'put every number in its home spot' idea as Missing Number. Once everything's been swapped into place, any spot that doesn't hold its correct number means two copies of the same value fought over the same spot — and that value is a duplicate.",
        time: "O(n)", space: "O(1) extra",
        code: `vector<int> findDuplicates(vector<int>& nums) {
    int n = nums.size(), i = 0;
    while (i < n) {
        int correct = nums[i] - 1;
        if (nums[i] != nums[correct]) swap(nums[i], nums[correct]);
        else i++;
    }
    vector<int> dupes;
    for (i = 0; i < n; i++) if (nums[i] != i + 1) dupes.push_back(nums[i]);
    return dupes;
}`,
        variations: ["Find the Duplicate Number (a clever cycle-detection trick avoids changing the array at all)"],
        gotchas: []
      },
      {
        name: "First Missing Positive",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/first-missing-positive/",
        idea: "The answer has to be somewhere between 1 and (array length + 1), so any number outside that range — negatives, zero, or numbers way too big — can just be ignored while sorting. Do the same 'swap into home spot' trick, but only for numbers that fit, then find the first spot that doesn't hold what it should.",
        time: "O(n)", space: "O(1)",
        code: `int firstMissingPositive(vector<int>& nums) {
    int n = nums.size(), i = 0;
    while (i < n) {
        int correct = nums[i] - 1;
        if (nums[i] > 0 && nums[i] <= n && nums[i] != nums[correct]) swap(nums[i], nums[correct]);
        else i++;
    }
    for (i = 0; i < n; i++) if (nums[i] != i + 1) return i + 1;
    return n + 1;
}`,
        variations: [],
        gotchas: ["This is the trickiest of the three — if you can figure this out on your own after doing Missing Number, you've really got the pattern."]
      },
      {
        name: "Find the Repeating and Missing Number",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/find-a-repeating-and-a-missing-number/",
        idea: "This is Missing Number and Find All Duplicates happening at the same time, in an array of size n containing values 1..n. Run the same cyclic-sort swap-into-home-position trick; the one spot that ends up NOT holding its correct value reveals both answers at once — the value sitting there is the repeat, and the value that should be there (its position + 1) is the one that's missing.",
        time: "O(n)", space: "O(1)",
        code: `pair<int,int> findRepeatingAndMissing(vector<int>& arr) {
    int n = arr.size(), i = 0;
    while (i < n) {
        int correct = arr[i] - 1;
        if (arr[i] != arr[correct]) swap(arr[i], arr[correct]);
        else i++;
    }
    for (i = 0; i < n; i++) {
        if (arr[i] != i + 1) return {arr[i], i + 1}; // {repeating, missing}
    }
    return {-1, -1};
}`,
        variations: ["There's also a pure-math approach using the sum and sum-of-squares of 1..n to solve two equations for the two unknowns — same result, no array mutation needed."],
        gotchas: []
      }
    ]
  },

  {
    id: "merge-intervals",
    name: "Merge Intervals",
    color: "#e06a5f",
    icon: "merge-intervals",
    trigger: "Array of [start, end] pairs · \"overlapping\", \"merge\", \"insert a new interval\", \"free time / meeting rooms\"",
    summary: "Sort by start time first — nearly always. Then walk through once, comparing each interval to the last one you kept.",
    problems: [
      {
        name: "Merge Intervals",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/merge-intervals/",
        idea: "You can only tell which intervals overlap once they're in order by start time — so always sort first. Then go through once: if the current interval starts before (or right when) the last one you kept ends, they overlap, so stretch the last one to cover both. Otherwise, it's a brand new group.",
        time: "O(n log n)", space: "O(n)",
        code: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> res = {intervals[0]};
    for (int i = 1; i < (int)intervals.size(); i++) {
        auto& last = res.back();
        auto& cur = intervals[i];
        if (cur[0] <= last[1]) last[1] = max(last[1], cur[1]);
        else res.push_back(cur);
    }
    return res;
}`,
        variations: [],
        gotchas: ["Skipping the sort step is the #1 mistake here — nothing after it works without sorted intervals."]
      },
      {
        name: "Insert Interval",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/insert-interval/",
        idea: "The list you're given is already sorted and doesn't overlap, so there's no need to re-sort anything. Just go through once in three steps: copy over every interval that ends before the new one starts, then stretch the new interval to cover any interval it overlaps with, then copy over everything that starts after.",
        time: "O(n)", space: "O(n)",
        code: `// 1. push intervals fully before newInterval
// 2. merge all overlapping intervals into newInterval (expand its bounds)
// 3. push newInterval, then push remaining intervals`,
        variations: [],
        gotchas: []
      },
      {
        name: "Non-overlapping Intervals",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/non-overlapping-intervals/",
        idea: "To keep as many non-overlapping intervals as possible, always favor whichever one finishes EARLIEST — finishing early leaves the most room for everything that comes after. That's why this time you sort by END time, not start time. Keep an interval only if it starts at or after the last one you kept ends; otherwise, it has to go.",
        time: "O(n log n)", space: "O(1)",
        code: `int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](auto& a, auto& b) { return a[1] < b[1]; });
    long lastEnd = LONG_MIN;
    int removed = 0;
    for (auto& iv : intervals) {
        if (iv[0] >= lastEnd) lastEnd = iv[1];
        else removed++;
    }
    return removed;
}`,
        variations: ["Minimum Number of Arrows to Burst Balloons (same shape, different story)"],
        gotchas: ["Sorting by END time instead of start time is the twist here — it's the classic trick question in this category."]
      },
      {
        name: "Meeting Rooms II",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/meeting-rooms-ii/",
        idea: "The number of rooms you need at any moment is just the number of meetings happening at the same time. Split all the start times and end times into two separate sorted lists. Walk through both together: every time a meeting starts before the earliest ongoing one ends, you need one more room; every time a meeting ends, you free one up.",
        time: "O(n log n)", space: "O(n)",
        code: `int minMeetingRooms(vector<vector<int>>& intervals) {
    int n = intervals.size();
    vector<int> starts(n), ends(n);
    for (int i = 0; i < n; i++) { starts[i] = intervals[i][0]; ends[i] = intervals[i][1]; }
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());
    int rooms = 0, maxRooms = 0, s = 0, e = 0;
    while (s < n) {
        if (starts[s] < ends[e]) { rooms++; s++; }
        else { rooms--; e++; }
        maxRooms = max(maxRooms, rooms);
    }
    return maxRooms;
}`,
        variations: [],
        gotchas: []
      }
    ]
  },

  {
    id: "matrix",
    name: "Matrix / 2D Array",
    color: "#8a6bf2",
    icon: "matrix",
    trigger: "2D grid input · \"rotate\", \"spiral\", \"set an entire row/column to zero\", \"search a sorted grid\"",
    summary: "Usually about careful index math (rotating, walking in a spiral) or cleverly reusing the grid itself to store extra info without extra memory.",
    problems: [
      {
        name: "Rotate Image",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/rotate-image/",
        idea: "Turning a grid 90 degrees is really just two simple moves in a row: first flip it across its diagonal (rows become columns), then flip each row left-to-right. Doing both directly on the same grid means you don't need a second grid to hold the result.",
        time: "O(n²)", space: "O(1)",
        code: `void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    // transpose
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            swap(matrix[i][j], matrix[j][i]);
    // reverse each row
    for (int i = 0; i < n; i++)
        reverse(matrix[i].begin(), matrix[i].end());
}`,
        variations: [],
        gotchas: ["Flip-then-reverse gives you a clockwise turn; reverse-then-flip gives you counter-clockwise — know which is which."]
      },
      {
        name: "Spiral Matrix",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/spiral-matrix/",
        idea: "Picture peeling the outer layer off a rectangle, over and over. Keep track of your four current edges — top, bottom, left, right. Walk across the top, down the right side, across the bottom, up the left side, then shrink each edge inward and repeat, until there's nothing left to peel.",
        time: "O(m·n)", space: "O(1) extra",
        code: `vector<int> spiralOrder(vector<vector<int>>& matrix) {
    int top = 0, bottom = matrix.size() - 1, left = 0, right = matrix[0].size() - 1;
    vector<int> res;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) res.push_back(matrix[top][j]);
        top++;
        for (int i = top; i <= bottom; i++) res.push_back(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int j = right; j >= left; j--) res.push_back(matrix[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) res.push_back(matrix[i][left]);
            left++;
        }
    }
    return res;
}`,
        variations: ["Spiral Matrix II (build a grid in spiral order instead of reading one)"],
        gotchas: ["The two safety checks before the last two loops stop you from re-visiting the same row/column on non-square grids."]
      },
      {
        name: "Set Matrix Zeroes",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/set-matrix-zeroes/",
        idea: "Instead of building a whole new grid to remember which rows and columns need zeroing, just use the grid's own first row and first column as your notes. Before you start writing notes there, remember whether the actual first row/column originally had a zero in it — otherwise you'll lose that information.",
        time: "O(m·n)", space: "O(1)",
        code: `// use matrix[i][0] and matrix[0][j] as markers for row i / col j
// but track separately whether the ORIGINAL first row/col had a zero`,
        variations: [],
        gotchas: ["Check if row 0 or column 0 originally had a zero BEFORE you start using them as your notes — you'll overwrite that info otherwise."]
      },
      {
        name: "Search a 2D Matrix",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/search-a-2d-matrix/",
        idea: "If every row ends smaller than the next row begins, the whole grid is secretly just one long sorted line wearing a 2D costume. So you can binary search it like a normal sorted array — just convert your 'flat' guess position back into a (row, column) using division and remainder.",
        time: "O(log(m·n))", space: "O(1)",
        code: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int m = matrix.size(), n = matrix[0].size();
    int l = 0, r = m * n - 1;
    while (l <= r) {
        int mid = (l + r) >> 1;
        int val = matrix[mid / n][mid % n];
        if (val == target) return true;
        val < target ? l = mid + 1 : r = mid - 1;
    }
    return false;
}`,
        variations: ["Search a 2D Matrix II (a different grid shape — start from the top-right corner instead)"],
        gotchas: ["This trick only works if every row's last number is smaller than the next row's first number."]
      }
    ]
  },

  {
    id: "monotonic-stack",
    name: "Monotonic Stack",
    color: "#5fbf6d",
    icon: "monotonic-stack",
    trigger: "\"Next bigger/smaller number\" · trapping water / biggest rectangle · you need to remember earlier numbers while scanning forward",
    summary: "A stack that's always kept going one direction — always increasing, or always decreasing. Numbers get pushed and popped at most once each, so it stays fast even though it looks like nested loops.",
    problems: [
      {
        name: "Next Greater Element I",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/next-greater-element-i/",
        idea: "The slow way checks every number against every number after it. Instead, keep a stack of numbers that are still 'waiting' to find something bigger than them. When a new, bigger number shows up, it's exactly the answer for everyone smaller still waiting on the stack — pop them off and record the answer, then add the new number to the stack.",
        time: "O(n)", space: "O(n)",
        code: `vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
    unordered_map<int,int> nextGreater;
    vector<int> stack;
    for (int i = nums2.size() - 1; i >= 0; i--) {
        while (!stack.empty() && stack.back() <= nums2[i]) stack.pop_back();
        nextGreater[nums2[i]] = stack.empty() ? -1 : stack.back();
        stack.push_back(nums2[i]);
    }
    vector<int> res;
    for (int x : nums1) res.push_back(nextGreater[x]);
    return res;
}`,
        variations: ["Next Greater Element II (a circular array — just loop through the array twice)", "Daily Temperatures"],
        gotchas: []
      },
      {
        name: "Daily Temperatures",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/daily-temperatures/",
        idea: "You need to know how many days you waited, not just the temperature — so keep positions (indices) on the stack instead of the temperatures themselves. Keep the stack in decreasing order of temperature. When a warmer day shows up, pop off every colder day underneath and record how many days each one waited.",
        time: "O(n)", space: "O(n)",
        code: `vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> res(n, 0), stack;
    for (int i = 0; i < n; i++) {
        while (!stack.empty() && temperatures[stack.back()] < temperatures[i]) {
            int j = stack.back(); stack.pop_back();
            res[j] = i - j;
        }
        stack.push_back(i);
    }
    return res;
}`,
        variations: [],
        gotchas: ["Store positions on the stack, not values, any time your answer needs a distance or index."]
      },
      {
        name: "Trapping Rain Water",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/trapping-rain-water/",
        idea: "The water sitting above any bar is limited by whichever is shorter: the tallest wall to its left, or the tallest wall to its right. Keep a stack of bars going from tall to short. When a taller bar finally shows up, it 'closes off' a little basin — pop the shorter bar underneath and work out how much water it could hold, based on the gap width and how tall the new wall is compared to what's still on the stack.",
        time: "O(n)", space: "O(n) (or O(1) with a two-pointer version)",
        code: `int trap(vector<int>& height) {
    vector<int> stack;
    int water = 0;
    for (int i = 0; i < (int)height.size(); i++) {
        while (!stack.empty() && height[i] > height[stack.back()]) {
            int top = stack.back(); stack.pop_back();
            if (stack.empty()) break;
            int dist = i - stack.back() - 1;
            int boundedH = min(height[i], height[stack.back()]) - height[top];
            water += dist * boundedH;
        }
        stack.push_back(i);
    }
    return water;
}`,
        variations: ["There's also a two-pointer version using left-max/right-max that uses no extra memory — worth learning both."],
        gotchas: []
      },
      {
        name: "Largest Rectangle in Histogram",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        idea: "For every bar, the biggest rectangle you can make using its height is limited by how far you can stretch left and right before hitting something shorter. Keep an increasing stack of bar positions. The moment a shorter bar shows up, every taller bar still on the stack has just found its right-hand limit — pop each one and calculate its rectangle.",
        time: "O(n)", space: "O(n)",
        code: `int largestRectangleArea(vector<int>& heights) {
    vector<int> stack;
    int best = 0;
    for (int i = 0; i <= (int)heights.size(); i++) {
        int cur = (i == (int)heights.size()) ? 0 : heights[i];
        while (!stack.empty() && heights[stack.back()] >= cur) {
            int height = heights[stack.back()]; stack.pop_back();
            int width = stack.empty() ? i : i - stack.back() - 1;
            best = max(best, height * width);
        }
        stack.push_back(i);
    }
    return best;
}`,
        variations: ["Maximal Rectangle (2D version — run this once per row using column heights)"],
        gotchas: ["Adding a fake bar of height 0 at the very end forces the stack to empty out completely, so nothing gets left unresolved."]
      }
    ]
  },

  {
    id: "greedy",
    name: "Greedy on Arrays",
    color: "#e0973f",
    icon: "greedy",
    trigger: "\"Fewest jumps/steps\" · \"can you reach the end\" · making the best choice right now provably leads to the best overall result",
    summary: "Make the best choice available at each step, and trust that it'll work out — the tricky part is convincing yourself it actually will.",
    problems: [
      {
        name: "Jump Game",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/jump-game/",
        idea: "You don't need to try every possible sequence of jumps. Just keep track of the single farthest spot you could reach so far as you scan left to right. If you ever land on a spot beyond that farthest point, no earlier jump could have gotten you here — you're stuck for good.",
        time: "O(n)", space: "O(1)",
        code: `bool canJump(vector<int>& nums) {
    int farthest = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (i > farthest) return false;
        farthest = max(farthest, i + nums[i]);
    }
    return true;
}`,
        variations: ["Jump Game II (find the fewest jumps needed, not just whether it's possible)"],
        gotchas: []
      },
      {
        name: "Jump Game II",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/jump-game-ii/",
        idea: "Think of it in layers: everything you can reach with your current jump is one layer, and you only take another jump once you've explored everything in the current layer. Track the farthest spot reachable overall, and the edge of your current layer. The moment your scan reaches that edge, you're forced to jump — so count it and extend the layer.",
        time: "O(n)", space: "O(1)",
        code: `int jump(vector<int>& nums) {
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < (int)nums.size() - 1; i++) {
        farthest = max(farthest, i + nums[i]);
        if (i == curEnd) { jumps++; curEnd = farthest; }
    }
    return jumps;
}`,
        variations: [],
        gotchas: ["Loop up to the second-to-last index — once you've already reached the end, you don't need one more jump."]
      },
      {
        name: "Gas Station",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/gas-station/",
        idea: "First off — a full loop is only possible at all if the total gas is at least the total cost. If that's not true, there's no answer. Otherwise, walk through keeping a running fuel balance from a tentative starting point. The moment it goes negative, that starting point (and everywhere between the old start and here) is proven impossible — so move your tentative start to right after here and reset the balance.",
        time: "O(n)", space: "O(1)",
        code: `int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < (int)gas.size(); i++) {
        int diff = gas[i] - cost[i];
        total += diff; tank += diff;
        if (tank < 0) { start = i + 1; tank = 0; }
    }
    return total >= 0 ? start : -1;
}`,
        variations: [],
        gotchas: ["Understanding WHY failing at one point rules out every start before it is the tricky bit — worth sitting with until it clicks."]
      },
      {
        name: "Candy",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/candy/",
        idea: "There are two rules to satisfy at once: get more candy than your left neighbor if you're rated higher, AND get more candy than your right neighbor if you're rated higher. One single pass can't handle both directions at the same time. So do it in two passes — one left to right for the left rule, one right to left for the right rule — and for each kid, keep whichever amount satisfies both.",
        time: "O(n)", space: "O(n)",
        code: `int candy(vector<int>& ratings) {
    int n = ratings.size();
    vector<int> candies(n, 1);
    for (int i = 1; i < n; i++)
        if (ratings[i] > ratings[i-1]) candies[i] = candies[i-1] + 1;
    for (int i = n - 2; i >= 0; i--)
        if (ratings[i] > ratings[i+1]) candies[i] = max(candies[i], candies[i+1] + 1);
    int total = 0;
    for (int c : candies) total += c;
    return total;
}`,
        variations: [],
        gotchas: []
      }
    ]
  },

  {
    id: "sorting-tricks",
    name: "Sorting-Based Tricks",
    color: "#6b8ff2",
    icon: "sorting-tricks",
    trigger: "The answer becomes obvious once the array is sorted, even if the question didn't explicitly ask you to sort",
    summary: "Sometimes the whole trick is just: sort it first. Once it's sorted, a simple scan or two-pointer sweep finishes the job.",
    problems: [
      {
        name: "Merge Sorted Array",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/merge-sorted-array/",
        idea: "Merging from the front would overwrite numbers you still need to compare later. The fix: merge from the BACK instead. Compare the largest remaining number in each array, and place the bigger one at the very end of the free space — working backward means you only ever write into spots that are already used up.",
        time: "O(m+n)", space: "O(1)",
        code: `void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        nums1[k--] = (i >= 0 && nums1[i] > nums2[j]) ? nums1[i--] : nums2[j--];
    }
}`,
        variations: [],
        gotchas: ["Merging from the back is the whole trick — merging from the front needs extra space to avoid overwriting things."]
      },
      {
        name: "Meeting Rooms (can you attend all of them?)",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/meeting-rooms/",
        idea: "Once you sort the meetings by start time, spotting a conflict is easy — a conflict can only happen between two meetings that are next to each other in that order. So sort first, then just compare each meeting's start time to the one right before it.",
        time: "O(n log n)", space: "O(1)",
        code: `bool canAttendMeetings(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    for (int i = 1; i < (int)intervals.size(); i++)
        if (intervals[i][0] < intervals[i-1][1]) return false;
    return true;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Kth Largest Element in an Array",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        idea: "Fully sorting the array does more work than you actually need, since you only care about one position. Quickselect is smarter: it partitions like quicksort does, but only keeps digging into whichever side actually contains the answer, throwing away the other side completely. A heap of size k is another good option, especially if numbers are arriving one at a time.",
        time: "O(n log n) if you sort, or O(n) on average with quickselect", space: "O(1) to O(k)",
        code: `// Quickselect: partition like quicksort, but only recurse into
// the side that contains the k-th index — discard the other half.
int quickSelect(vector<int>& nums, int l, int r, int kSmallest) {
    int pivot = nums[r], i = l;
    for (int j = l; j < r; j++)
        if (nums[j] <= pivot) swap(nums[i++], nums[j]);
    swap(nums[i], nums[r]);
    if (i == kSmallest) return nums[i];
    return i < kSmallest ? quickSelect(nums, i + 1, r, kSmallest)
                          : quickSelect(nums, l, i - 1, kSmallest);
}
int findKthLargest(vector<int>& nums, int k) {
    return quickSelect(nums, 0, nums.size() - 1, nums.size() - k);
}`,
        variations: ["Top K Frequent Elements (bucket sort by frequency runs in O(n))"],
        gotchas: ["Being able to explain all three options (sort / heap / quickselect) and their trade-offs is usually what interviewers want."]
      },
      {
        name: "Merge Two Sorted Arrays Without Extra Space",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/merge-two-sorted-arrays/",
        idea: "Unlike the LeetCode version, here neither array has spare room at the end to merge into — both are genuinely full and separate. The 'gap method' (based on an idea from Shell sort) handles this: start with a gap roughly half the combined length, and compare elements that far apart across BOTH arrays as if they were one, swapping if out of order. Shrink the gap each round (roughly halving it) until the gap reaches 1 and everything's settled into place.",
        time: "O((m+n) log(m+n))", space: "O(1)",
        code: `void mergeNoExtraSpace(vector<int>& a, vector<int>& b) {
    int n = a.size(), m = b.size();
    int gap = ceil((n + m) / 2.0);
    while (gap > 0) {
        int i = 0, j = gap;
        while (j < n + m) {
            int vi = (i < n) ? a[i] : b[i - n];
            int vj = (j < n) ? a[j] : b[j - n];
            if (vi > vj) {
                if (i < n && j < n) swap(a[i], a[j]);
                else if (i < n && j >= n) swap(a[i], b[j - n]);
                else swap(b[i - n], b[j - n]);
            }
            i++; j++;
        }
        if (gap == 1) break;
        gap = ceil(gap / 2.0);
    }
}`,
        variations: [],
        gotchas: ["Treating the two arrays as one continuous virtual array (using index math to figure out which real array a position falls into) is the trickiest part to get right — draw it out on paper first."]
      },
      {
        name: "Count Inversions",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/counting-inversions/",
        idea: "An inversion is a pair where a bigger number comes before a smaller one. Checking every pair is O(n²); instead, piggyback on merge sort. While merging two already-sorted halves, any time you take an element from the RIGHT half before you've finished the LEFT half, every remaining element in the left half forms an inversion with it — count all of those at once instead of one at a time.",
        time: "O(n log n)", space: "O(n)",
        code: `long merge(vector<int>& arr, int l, int mid, int r) {
    vector<int> temp;
    int i = l, j = mid + 1;
    long inversions = 0;
    while (i <= mid && j <= r) {
        if (arr[i] <= arr[j]) temp.push_back(arr[i++]);
        else { temp.push_back(arr[j++]); inversions += (mid - i + 1); }
    }
    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= r) temp.push_back(arr[j++]);
    for (int k = l; k <= r; k++) arr[k] = temp[k - l];
    return inversions;
}
long countInversions(vector<int>& arr, int l, int r) {
    if (l >= r) return 0;
    int mid = (l + r) / 2;
    long count = countInversions(arr, l, mid) + countInversions(arr, mid + 1, r);
    count += merge(arr, l, mid, r);
    return count;
}`,
        variations: ["Reverse Pairs (same merge-sort skeleton, different condition for counting)"],
        gotchas: ["The `(mid - i + 1)` line is the whole trick — it's counting a whole batch of inversions in one step instead of looping through them individually."]
      },
      {
        name: "Reverse Pairs",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/reverse-pairs/",
        idea: "A reverse pair is a stricter version of an inversion: `arr[i] > 2 * arr[j]` for i < j. Same merge-sort skeleton as Count Inversions, but the counting step needs its own separate pass with a separate pointer, since the '2×' condition doesn't shrink and grow in sync with the normal merge comparison the way plain inversions do.",
        time: "O(n log n)", space: "O(n)",
        code: `int countAcross(vector<int>& arr, int l, int mid, int r) {
    int count = 0, j = mid + 1;
    for (int i = l; i <= mid; i++) {
        while (j <= r && arr[i] > 2LL * arr[j]) j++;
        count += (j - (mid + 1));
    }
    return count;
}
void merge(vector<int>& arr, int l, int mid, int r) {
    vector<int> temp;
    int i = l, j = mid + 1;
    while (i <= mid && j <= r) temp.push_back(arr[i] <= arr[j] ? arr[i++] : arr[j++]);
    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= r) temp.push_back(arr[j++]);
    for (int k = l; k <= r; k++) arr[k] = temp[k - l];
}
int reversePairs(vector<int>& arr, int l, int r) {
    if (l >= r) return 0;
    int mid = (l + r) / 2;
    int count = reversePairs(arr, l, mid) + reversePairs(arr, mid + 1, r);
    count += countAcross(arr, l, mid, r);
    merge(arr, l, mid, r);
    return count;
}`,
        variations: [],
        gotchas: ["Count the reverse pairs BEFORE merging the two halves — merging reorders elements, which would break the left/right split the counting step depends on."]
      }
    ]
  },

  {
    id: "bit-manipulation",
    name: "Bit Manipulation",
    color: "#b06bf2",
    icon: "bit-manipulation",
    trigger: "\"Find the one number that's different\" · needs zero extra memory and numbers come in pairs · anything about powers of two",
    summary: "XOR cancels out matching pairs of numbers, and a few small bit tricks can isolate exactly the bit you need — handy whenever a hashmap works but the question wants zero extra memory.",
    problems: [
      {
        name: "Single Number",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/single-number/",
        idea: "XOR has a neat property: any number XORed with itself becomes 0, and the order you XOR things in doesn't matter. So if every number except one shows up exactly twice, XORing the whole array together cancels out every pair, leaving only the lonely number standing.",
        time: "O(n)", space: "O(1)",
        code: `int singleNumber(vector<int>& nums) {
    int res = 0;
    for (int x : nums) res ^= x;
    return res;
}`,
        variations: ["Single Number II (everything else appears 3 times — needs counting bits at each position)", "Single Number III (two unique numbers instead of one)"],
        gotchas: []
      },
      {
        name: "Single Number III",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/single-number-iii/",
        idea: "With two unique numbers instead of one, XORing everything gives you (a XOR b), not either number by itself. But that result still tells you something: any bit that's turned on in it must be different between a and b. Pick one such bit, and use it to split the whole array into two groups — a and b are guaranteed to land in different groups. XOR each group on its own to get each number.",
        time: "O(n)", space: "O(1)",
        code: `vector<int> singleNumber3(vector<int>& nums) {
    int xorAll = 0;
    for (int x : nums) xorAll ^= x;
    int diffBit = xorAll & (-xorAll); // lowest set bit
    int a = 0;
    for (int x : nums) if (x & diffBit) a ^= x;
    int b = xorAll ^ a;
    return {a, b};
}`,
        variations: [],
        gotchas: ["`x & (-x)` is a handy trick that isolates the lowest 'on' bit of a number — it shows up in a lot of bit problems."]
      },
      {
        name: "Counting Bits",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/counting-bits/",
        idea: "Instead of counting the bits of every number from scratch, notice that any number is just a smaller number (itself shifted right by one) with one extra bit tacked on. So its bit count is: the bit count of that smaller number, plus 1 if the original number is odd. You can build the whole answer list using answers you already calculated.",
        time: "O(n)", space: "O(n)",
        code: `vector<int> countBits(int n) {
    vector<int> res(n + 1, 0);
    for (int i = 1; i <= n; i++) res[i] = res[i >> 1] + (i & 1);
    return res;
}`,
        variations: [],
        gotchas: []
      }
    ]
  },

  {
    id: "construction-rearrangement",
    name: "Array Construction & Rearrangement",
    color: "#57c2e8",
    icon: "construction-rearrangement",
    trigger: "Build the array according to a specific rule, or rearrange it into a very particular target shape — not just sort it",
    summary: "These don't fit the usual 'scan and track a value' mold — each one follows its own specific construction or rearrangement rule that you mostly just need to have seen before.",
    problems: [
      {
        name: "Pascal's Triangle I",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/pascals-triangle/",
        idea: "Every entry is the sum of the two entries diagonally above it in the previous row — except the edges of each row, which are always 1. Build row by row: start each new row with a 1, fill the middle by adding pairs from the row before it, and end with a 1.",
        time: "O(n²) total across all rows", space: "O(n²) for the output",
        code: `vector<vector<int>> generate(int numRows) {
    vector<vector<int>> triangle;
    for (int i = 0; i < numRows; i++) {
        vector<int> row(i + 1, 1);
        for (int j = 1; j < i; j++) row[j] = triangle[i-1][j-1] + triangle[i-1][j];
        triangle.push_back(row);
    }
    return triangle;
}`,
        variations: ["Pascal's Triangle II (just return a single row — can be done with O(k) space using the nCr formula)"],
        gotchas: []
      },
      {
        name: "Next Permutation",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/next-permutation/",
        idea: "To find the next lexicographically bigger arrangement, you want to change the array as little as possible, and as far to the right as possible. Scan from the right to find the first spot where the sequence stops being non-increasing (the 'break point') — that element needs to grow. Swap it with the smallest element to its right that's still bigger than it, then reverse everything after the break point to put it in the smallest possible order.",
        time: "O(n)", space: "O(1)",
        code: `void nextPermutation(vector<int>& nums) {
    int n = nums.size(), i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--; // find the break point
    if (i >= 0) {
        int j = n - 1;
        while (nums[j] <= nums[i]) j--; // find the smallest element bigger than nums[i]
        swap(nums[i], nums[j]);
    }
    reverse(nums.begin() + i + 1, nums.end()); // put the tail in ascending order
}`,
        variations: [],
        gotchas: ["If no break point exists (the whole array is non-increasing), the array is already the highest permutation — reversing the whole thing correctly wraps around to the lowest one."]
      },
      {
        name: "Rearrange Array Elements by Sign",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/rearrange-array-elements-by-sign/",
        idea: "The array has an equal number of positive and negative numbers, and needs to alternate positive-negative-positive-negative while keeping each group's original relative order. Walk through once, placing each positive number into the next even slot (0, 2, 4...) and each negative number into the next odd slot (1, 3, 5...) of a new result array.",
        time: "O(n)", space: "O(n)",
        code: `vector<int> rearrangeArray(vector<int>& nums) {
    vector<int> res(nums.size());
    int posIdx = 0, negIdx = 1;
    for (int x : nums) {
        if (x > 0) { res[posIdx] = x; posIdx += 2; }
        else { res[negIdx] = x; negIdx += 2; }
    }
    return res;
}`,
        variations: [],
        gotchas: ["This assumes an equal split of positives and negatives (as the problem guarantees) — an unequal split needs a different approach for the leftover elements."]
      }
    ]
  }
];

// Quick-reference: keyword → pattern, used by the pattern finder
const TRIGGER_TABLE = [
  { keyword: "Basic scans — largest value, is it sorted, linear search", pattern: "array-basics" },
  { keyword: "Rearranging the array itself, no extra array allowed", pattern: "in-place-manipulation" },
  { keyword: "Sorted array + finding a pair", pattern: "two-pointers" },
  { keyword: "Contiguous stretch of numbers, with some limit or rule", pattern: "sliding-window" },
  { keyword: "Asked the sum of a range, over and over", pattern: "prefix-sum" },
  { keyword: "\"Subarray sum equals k\"", pattern: "prefix-sum" },
  { keyword: "Max or min sum of a contiguous stretch", pattern: "kadane" },
  { keyword: "Sorted or rotated-sorted array — search it fast", pattern: "binary-search" },
  { keyword: "\"Find the smallest/largest value that still works\"", pattern: "binary-search" },
  { keyword: "\"Have I seen this number before?\"", pattern: "hashing" },
  { keyword: "Numbers limited to a known range, find missing/duplicate", pattern: "cyclic-sort" },
  { keyword: "Array of [start, end] pairs", pattern: "merge-intervals" },
  { keyword: "2D grid — rotate, spiral, or zero out rows/columns", pattern: "matrix" },
  { keyword: "\"Next bigger/smaller number\"", pattern: "monotonic-stack" },
  { keyword: "\"Fewest jumps\" or \"can you reach the end\"", pattern: "greedy" },
  { keyword: "Sorting it first makes everything easy", pattern: "sorting-tricks" },
  { keyword: "\"Find the one number that's different\", no extra memory", pattern: "bit-manipulation" },
  { keyword: "Build or rearrange the array into a specific target shape", pattern: "construction-rearrangement" }
];

  window.TOPIC_REGISTRY = window.TOPIC_REGISTRY || {};
  window.TOPIC_REGISTRY.arrays = { topic: TOPIC, patterns: PATTERNS, triggerTable: TRIGGER_TABLE };
})();