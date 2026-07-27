// ============================================================
// DSA Linked List — Pattern Data
// Registers itself into window.TOPIC_REGISTRY["linkedlist"] so
// multiple topic files can coexist without clashing on names.
//
// Code snippets assume a plain node shape: { val, next }
// ============================================================
(function () {

const TOPIC = {
  id: "linkedlist",
  title: "Linked List",
  tagline: "No indexes here — just pointers. Learn a handful of pointer moves and most linked list questions fall into place."
};

const PATTERNS = [
  {
    id: "ll-basics",
    name: "Linked List Basics",
    color: "#8db4f2",
    icon: "ll-basics",
    trigger: "Building blocks — creating a node, inserting/deleting at the head, walking through the list, searching for a value",
    summary: "Before any of the clever tricks, you need the fundamentals down cold. These aren't really 'patterns' — they're the vocabulary every other technique on this page is built out of.",
    problems: [
      {
        name: "Introduction to Singly Linked List",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/introduction-to-linked-list/",
        idea: "A linked list is just a chain of nodes, where each node holds a value and a pointer to the next node. Unlike an array, the nodes aren't sitting next to each other in memory — the only way to get from one to the next is by following that pointer, one hop at a time. That's why there's no 'index 5' shortcut like arrays have; you have to walk there.",
        time: "O(1) to create a node", space: "O(1) per node",
        code: `// A node is just a small struct with a value and a pointer
struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
ListNode* head = new ListNode(1, new ListNode(2, new ListNode(3)));`,
        variations: [],
        gotchas: ["Since there's no direct indexing, almost every linked list technique is really just a clever way of walking through the chain with one or more pointers."]
      },
      {
        name: "Insertion at the Head of a Linked List",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/insert-a-node-at-the-head-of-a-linked-list/",
        idea: "To add a new node at the very front, just point the new node's `next` at the current head, and then treat the new node as the head from now on. Nothing else in the list needs to move.",
        time: "O(1)", space: "O(1)",
        code: `ListNode* insertAtHead(ListNode* head, int val) {
    ListNode* newNode = new ListNode(val);
    newNode->next = head;
    return newNode; // this is the new head
}`,
        variations: ["Inserting at the tail needs a full walk to the end instead — O(n) unless you keep a separate tail pointer."],
        gotchas: ["Always return the new head — the caller's old `head` variable is now out of date."]
      },
      {
        name: "Deletion of the Head of a Linked List",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/delete-head-of-a-linked-list/",
        idea: "To remove the first node, the new head simply becomes whatever the old head was pointing to next. The old head node just gets left behind with nothing pointing to it, so it's effectively gone.",
        time: "O(1)", space: "O(1)",
        code: `ListNode* deleteHead(ListNode* head) {
    if (!head) return nullptr;
    return head->next; // this is the new head
}`,
        variations: [],
        gotchas: ["Always check for an empty list first — deleting the head of nothing should just do nothing."]
      },
      {
        name: "Find the Length of a Linked List",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/count-number-of-nodes-in-a-given-linked-list/",
        idea: "There's no shortcut — just walk from the head to the end, counting one for every node you pass, until you hit a null pointer.",
        time: "O(n)", space: "O(1)",
        code: `int length(ListNode* head) {
    int count = 0;
    ListNode* cur = head;
    while (cur) { count++; cur = cur->next; }
    return count;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Search a Value in a Linked List",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/search-an-element-in-a-linked-list-iterative-and-recursive/",
        idea: "Walk from the head, checking each node's value as you pass it, until you either find a match or run out of nodes. Since there's no index to jump to, there's no faster way to search a plain linked list — it's always a full walk in the worst case.",
        time: "O(n)", space: "O(1)",
        code: `bool search(ListNode* head, int target) {
    ListNode* cur = head;
    while (cur) {
        if (cur->val == target) return true;
        cur = cur->next;
    }
    return false;
}`,
        variations: [],
        gotchas: ["This is the exact reason many linked-list problems use fast/slow pointers or other tricks — you can't binary search a list, since you can't jump straight to the middle."]
      }
    ]
  },
  {
    id: "fast-slow-pointers",
    name: "Fast & Slow Pointers",
    color: "#46c2c2",
    icon: "fast-slow-pointers",
    trigger: "Detect a cycle · find the middle node · check something structural about the list, all without extra memory",
    summary: "Two pointers move through the list at different speeds — one step at a time, and two steps at a time. If they ever meet, there's a loop. If the fast one finishes, the slow one is sitting right in the middle.",
    problems: [
      {
        name: "Linked List Cycle",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/linked-list-cycle/",
        idea: "Send two pointers down the list — one moves one node at a time, the other moves two nodes at a time. If there's no cycle, the fast pointer simply reaches the end and stops. But if there IS a cycle, the fast pointer eventually laps the slow one, and they land on the exact same node — that's your proof a loop exists.",
        time: "O(n)", space: "O(1)",
        code: `bool hasCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
        variations: ["Linked List Cycle II (find exactly where the cycle starts)"],
        gotchas: ["Always check both `fast` and `fast.next` before moving it — otherwise you'll crash trying to read `.next.next` off a null node."]
      },
      {
        name: "Linked List Cycle II",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/linked-list-cycle-ii/",
        idea: "First find the meeting point using the slow/fast trick from Cycle I. Then here's the clever bit: put a new pointer back at the very start of the list, and move it and the meeting-point pointer forward one step at a time, together. They'll meet again exactly at the start of the cycle — it's a bit of math that always works out this way.",
        time: "O(n)", space: "O(1)",
        code: `ListNode *detectCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) {
            ListNode *ptr = head;
            while (ptr != slow) { ptr = ptr->next; slow = slow->next; }
            return ptr;
        }
    }
    return nullptr;
}`,
        variations: [],
        gotchas: ["It's fine if this feels like magic the first time — moving one pointer from the head and one from the meeting point, both one step at a time, always converges at the cycle's start."]
      },
      {
        name: "Middle of the Linked List",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/middle-of-the-linked-list/",
        idea: "Move one pointer twice as fast as the other. By the time the fast one reaches the end of the list, the slow one — moving at half the speed — is sitting exactly in the middle.",
        time: "O(n)", space: "O(1)",
        code: `ListNode* middleNode(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
        variations: [],
        gotchas: ["If the list has an even number of nodes, this naturally lands on the second of the two middle nodes — double check which one the question actually wants."]
      },
      {
        name: "Palindrome Linked List",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/palindrome-linked-list/",
        idea: "Find the middle of the list using the fast/slow trick, reverse the second half in place, then walk both halves from their starting points, comparing values as you go. If every pair matches, it's a palindrome.",
        time: "O(n)", space: "O(1)",
        code: `// 1. find the middle with slow/fast pointers
// 2. reverse the second half
// 3. compare the first half and reversed second half node by node
bool isPalindrome(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    ListNode *prev = nullptr, *cur = slow;
    while (cur) { ListNode* next = cur->next; cur->next = prev; prev = cur; cur = next; }
    ListNode *p1 = head, *p2 = prev;
    while (p2) {
        if (p1->val != p2->val) return false;
        p1 = p1->next; p2 = p2->next;
    }
    return true;
}`,
        variations: [],
        gotchas: ["Reversing the second half in place is what gets you down to O(1) space — copying values into an array works too, but that uses O(n) space instead."]
      },
      {
        name: "Length of Loop in a Linked List",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/find-length-of-loop-in-linked-list/",
        idea: "First find the meeting point using the usual slow/fast trick — that proves a loop exists and gives you a node that's definitely inside it. Then just keep one pointer moving from there, counting steps, until it comes back around to that same node. Whatever count you land on is the loop's length.",
        time: "O(n)", space: "O(1)",
        code: `int countNodesInLoop(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) {
            int count = 1;
            ListNode* ptr = slow->next;
            while (ptr != slow) { count++; ptr = ptr->next; }
            return count;
        }
    }
    return 0; // no loop
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Delete the Middle Node of a Linked List",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/",
        idea: "This is the fast/slow trick from 'Middle of the Linked List', with one small twist: you need the node just BEFORE the middle so you can rewire its `next` pointer around the middle node. Keep a trailing pointer one step behind the slow pointer as you go, and use it to do the actual deletion once the slow pointer reaches the middle.",
        time: "O(n)", space: "O(1)",
        code: `ListNode* deleteMiddle(ListNode* head) {
    if (!head->next) return nullptr;
    ListNode *slow = head, *fast = head, *prev = nullptr;
    while (fast && fast->next) {
        prev = slow;
        slow = slow->next;
        fast = fast->next->next;
    }
    prev->next = slow->next;
    return head;
}`,
        variations: [],
        gotchas: ["Handle the one-node list as a special case first — there's no 'middle to delete' that leaves anything behind."]
      }
    ]
  },

  {
    id: "reversal",
    name: "In-Place Reversal",
    color: "#f2884f",
    icon: "reversal",
    trigger: "Reverse the whole list, or reverse it in groups or ranges",
    summary: "Walk through the list once, flipping each node's `next` pointer to point backward instead of forward, carefully keeping track of where you came from.",
    problems: [
      {
        name: "Reverse Linked List",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/reverse-linked-list/",
        idea: "Keep track of the node right before the one you're looking at. At each node, before moving on, flip its `next` pointer to point backward at the previous node instead of forward. Then shift everything along — previous becomes current, current becomes next — and repeat.",
        time: "O(n)", space: "O(1)",
        code: `ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *cur = head;
    while (cur) {
        ListNode* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`,
        variations: ["Reverse Linked List II (only reverse part of the list)", "Reverse Nodes in k-Group"],
        gotchas: ["Save `cur.next` into a temporary variable BEFORE you overwrite it — otherwise you lose your way forward through the rest of the list."]
      },
      {
        name: "Reverse a Linked List (Recursive)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/reverse-linked-list/",
        idea: "Trust the recursion: assume a call to reverse the REST of the list (everything after the current node) already works and gives you back the new head. All that's left for the current node to do is point the node after it back at itself, then cut its own forward link. Unwinding all the way back up finishes the reversal.",
        time: "O(n)", space: "O(n) for the call stack",
        code: `ListNode* reverse(ListNode* head) {
    if (!head || !head->next) return head; // base case
    ListNode* newHead = reverse(head->next);
    head->next->next = head;
    head->next = nullptr;
    return newHead;
}`,
        variations: [],
        gotchas: ["The iterative version is usually preferred in interviews since it uses O(1) space instead of O(n) call-stack space — but knowing both shows you understand the problem more deeply."]
      },
      {
        name: "Reverse Linked List II",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/reverse-linked-list-ii/",
        idea: "Walk to the node right before where the reversal should start, and hold onto it. Reverse just that middle section using the normal reversal trick. Then reconnect: the piece before the section links to the new start of the reversed part, and the old start (now at the end of the reversed section) links to whatever comes right after.",
        time: "O(n)", space: "O(1)",
        code: `// walk to the node before position 'left', remember it as 'beforeStart'
// reverse the nodes from 'left' to 'right' using the standard reversal loop
// reconnect: beforeStart->next -> new head of the reversed section
//            old start of the section -> node right after 'right'
ListNode* reverseBetween(ListNode* head, int left, int right) {
    ListNode dummy(0); dummy.next = head;
    ListNode* beforeStart = &dummy;
    for (int i = 0; i < left - 1; i++) beforeStart = beforeStart->next;
    ListNode* oldStart = beforeStart->next;
    ListNode* prev = nullptr, *cur = oldStart;
    for (int i = 0; i <= right - left; i++) {
        ListNode* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    beforeStart->next = prev;
    oldStart->next = cur;
    return dummy.next;
}`,
        variations: [],
        gotchas: ["Using a dummy node placed before the head avoids annoying edge cases when the reversal starts right at position 1."]
      },
      {
        name: "Reverse Nodes in k-Group",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
        idea: "Same reversal trick as before, just repeated on chunks of k nodes at a time. Before reversing each chunk, check there are actually k nodes left to reverse — if fewer than k remain, leave that last leftover chunk exactly as it is.",
        time: "O(n)", space: "O(1)",
        code: `// check there are at least k nodes remaining
// reverse the next k nodes using the standard reversal loop
// connect the previous chunk's tail to this chunk's new head
// repeat for the next chunk
ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode* node = head;
    for (int i = 0; i < k; i++) {
        if (!node) return head; // fewer than k nodes left, leave as is
        node = node->next;
    }
    ListNode *prev = reverseKGroup(node, k), *cur = head;
    for (int i = 0; i < k; i++) {
        ListNode* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`,
        variations: [],
        gotchas: ["Counting ahead to make sure k nodes actually exist before reversing is the step people skip — it's exactly what handles the leftover partial group correctly."]
      },
      {
        name: "Swap Nodes in Pairs",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/swap-nodes-in-pairs/",
        idea: "This is really just 'Reverse Nodes in k-Group' with k fixed at 2. Swap every pair of neighboring nodes by carefully re-pointing three links at a time, then move on to the next pair.",
        time: "O(n)", space: "O(1)",
        code: `ListNode* swapPairs(ListNode* head) {
    ListNode dummy(0); dummy.next = head;
    ListNode* prev = &dummy;
    while (prev->next && prev->next->next) {
        ListNode *first = prev->next, *second = first->next;
        first->next = second->next;
        second->next = first;
        prev->next = second;
        prev = first;
    }
    return dummy.next;
}`,
        variations: [],
        gotchas: ["A dummy node placed before the head makes swapping the very first pair much less fiddly to write."]
      },
      {
        name: "Add One to a Number Represented by a Linked List",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/add-1-number-represented-linked-list/",
        idea: "The digits are stored with the most significant digit first — the opposite order you'd want for doing addition by hand, where you start from the last digit. The fix: reverse the list first, so now you're adding from the ones place forward, same as normal addition with carrying. Add 1, carry as needed, then reverse the result back to the correct order.",
        time: "O(n)", space: "O(1)",
        code: `// 1. reverse the list
// 2. walk through adding 1 to the first node, carrying over into the
//    next node whenever a digit rolls over from 9 to 0
// 3. if there's still a carry after the last node, add one more node
// 4. reverse the list back to its original order
ListNode* addOne(ListNode* head) {
    head = reverseList(head); // reuse the reversal helper
    ListNode* cur = head;
    int carry = 1;
    ListNode* last9 = nullptr;
    while (cur) {
        cur->val += carry;
        carry = cur->val / 10;
        cur->val %= 10;
        if (carry == 0) break;
        cur = cur->next;
    }
    head = reverseList(head);
    if (carry) {
        ListNode* newHead = new ListNode(carry);
        newHead->next = head;
        return newHead;
    }
    return head;
}`,
        variations: [],
        gotchas: ["A recursive approach can avoid reversing entirely — the recursion naturally processes the list from the last digit backward. Either approach is fine to mention."]
      }
    ]
  },

  {
    id: "gap-technique",
    name: "Two-Pointer Gap",
    color: "#8f6bf2",
    icon: "gap-technique",
    trigger: "Find something 'n nodes from the end' · needs to be solved in a single pass",
    summary: "Move one pointer out ahead first to create a fixed gap between it and a second pointer. Then move both together — when the front one hits the end, the back one is exactly where you need it.",
    problems: [
      {
        name: "Remove Nth Node From End of List",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        idea: "Send one pointer n steps ahead first. Then move both pointers forward together, one step at a time. Thanks to that head start, by the time the front pointer reaches the end, the back pointer is sitting exactly n nodes from the end — right where you need to remove a node.",
        time: "O(n)", space: "O(1)",
        code: `ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0); dummy.next = head;
    ListNode *fast = &dummy, *slow = &dummy;
    for (int i = 0; i < n; i++) fast = fast->next;
    while (fast->next) { fast = fast->next; slow = slow->next; }
    slow->next = slow->next->next;
    return dummy.next;
}`,
        variations: [],
        gotchas: ["Use a dummy node before the head — without it, removing the very first node of the list becomes an annoying special case."]
      },
      {
        name: "Intersection of Two Linked Lists",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/intersection-of-two-linked-lists/",
        idea: "If the two lists are different lengths, walking them side by side won't line up at the intersection point. The trick: walk pointer A to the end of list A, then send it down list B; walk pointer B to the end of list B, then send it down list A. Both pointers end up traveling the exact same total distance, so they arrive at the intersection point (or both hit the end) at exactly the same time.",
        time: "O(m+n)", space: "O(1)",
        code: `ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
    ListNode *a = headA, *b = headB;
    while (a != b) {
        a = a ? a->next : headB;
        b = b ? b->next : headA;
    }
    return a;
}`,
        variations: [],
        gotchas: ["This still works correctly even when the lists never intersect — both pointers simply reach null at the same time, and you correctly return null."]
      },
      {
        name: "Rotate List",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/rotate-list/",
        idea: "First figure out the list's length and connect its tail back to its head — turning it into a circle for a moment. Then walk forward to find where the new break should be, and cut the circle open there to get the rotated list.",
        time: "O(n)", space: "O(1)",
        code: `// 1. find the length and the tail, then connect tail->next = head
// 2. walk (length - k % length) steps from head to find the new tail
// 3. break the circle: newHead = newTail->next; newTail->next = nullptr
ListNode* rotateRight(ListNode* head, int k) {
    if (!head || !head->next) return head;
    int length = 1;
    ListNode* tail = head;
    while (tail->next) { tail = tail->next; length++; }
    tail->next = head; // make it circular
    k = k % length;
    ListNode* newTail = head;
    for (int i = 0; i < length - k - 1; i++) newTail = newTail->next;
    ListNode* newHead = newTail->next;
    newTail->next = nullptr;
    return newHead;
}`,
        variations: [],
        gotchas: ["Always reduce k with `k % length` first — rotating by the full length (or a multiple of it) changes nothing, and skipping this makes you loop around far more than necessary."]
      }
    ]
  },

  {
    id: "dummy-node",
    name: "Dummy Node Technique",
    color: "#f2c14f",
    icon: "dummy-node",
    trigger: "The head of the list itself might need to change or get removed · merging or inserting nodes",
    summary: "Create a fake node that points at the real head before you start working. It means you never have to write special-case code for 'what if the head changes' — you just return dummy.next at the very end.",
    problems: [
      {
        name: "Merge Two Sorted Lists",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/merge-two-sorted-lists/",
        idea: "This works exactly like merging two sorted arrays. Keep a pointer building the new list, and at every step attach whichever of the two current nodes has the smaller value. A dummy starting node means you don't need any special logic for picking the very first node of the result.",
        time: "O(m+n)", space: "O(1)",
        code: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* cur = &dummy;
    while (l1 && l2) {
        if (l1->val <= l2->val) { cur->next = l1; l1 = l1->next; }
        else { cur->next = l2; l2 = l2->next; }
        cur = cur->next;
    }
    cur->next = l1 ? l1 : l2;
    return dummy.next;
}`,
        variations: ["Merge K Sorted Lists (repeat this merge, or use a min-heap)"],
        gotchas: []
      },
      {
        name: "Remove Linked List Elements",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/remove-linked-list-elements/",
        idea: "Without a dummy node, deleting a matching value right at the start of the list needs different code than deleting one in the middle. With a dummy node sitting before the real head, both cases become identical — just skip past any node whose value matches what you're removing.",
        time: "O(n)", space: "O(1)",
        code: `ListNode* removeElements(ListNode* head, int val) {
    ListNode dummy(0); dummy.next = head;
    ListNode* cur = &dummy;
    while (cur->next) {
        if (cur->next->val == val) cur->next = cur->next->next;
        else cur = cur->next;
    }
    return dummy.next;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Partition List",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/partition-list/",
        idea: "Build two separate lists as you scan through the original one — one collecting everything smaller than x, one collecting everything else. At the end, just join the second list onto the tail of the first. Two dummy nodes make both lists easy to build without special-casing their starts.",
        time: "O(n)", space: "O(1)",
        code: `ListNode* partition(ListNode* head, int x) {
    ListNode beforeDummy(0), afterDummy(0);
    ListNode *before = &beforeDummy, *after = &afterDummy;
    ListNode* cur = head;
    while (cur) {
        if (cur->val < x) { before->next = cur; before = cur; }
        else { after->next = cur; after = cur; }
        cur = cur->next;
    }
    after->next = nullptr;
    before->next = afterDummy.next;
    return beforeDummy.next;
}`,
        variations: [],
        gotchas: ["Don't forget to cut off the end of the second list with `after.next = null` — skipping this can leave a leftover loop in the final list."]
      },
      {
        name: "Add Two Numbers",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/add-two-numbers/",
        idea: "Each list stores one digit per node, in reverse order — so this is really just long addition, done one digit (node) at a time, carrying over into the next digit whenever a sum hits double digits. A dummy node makes building the result list simple.",
        time: "O(max(m,n))", space: "O(max(m,n))",
        code: `ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* cur = &dummy;
    int carry = 0;
    while (l1 || l2 || carry) {
        int sum = (l1 ? l1->val : 0) + (l2 ? l2->val : 0) + carry;
        carry = sum / 10;
        cur->next = new ListNode(sum % 10);
        cur = cur->next;
        l1 = l1 ? l1->next : nullptr;
        l2 = l2 ? l2->next : nullptr;
    }
    return dummy.next;
}`,
        variations: [],
        gotchas: ["Don't stop just because both lists have run out — if there's still a leftover carry, you need one more node for it."]
      },
      {
        name: "Sort a Linked List of 0s, 1s, and 2s",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/sort-a-linked-list-of-0s-1s-or-2s/",
        idea: "This is the Dutch National Flag idea (the same one used to sort an array of 0s, 1s, and 2s) but built with three separate mini-lists instead of swapping in place. Walk through once, attaching each node to a '0 list', '1 list', or '2 list' depending on its value, then join all three chains together at the end. Three dummy nodes make each chain easy to build without special-casing its start.",
        time: "O(n)", space: "O(1)",
        code: `ListNode* sortZeroOneTwo(ListNode* head) {
    ListNode d0(0), d1(0), d2(0);
    ListNode *t0 = &d0, *t1 = &d1, *t2 = &d2, *cur = head;
    while (cur) {
        if (cur->val == 0) { t0->next = cur; t0 = cur; }
        else if (cur->val == 1) { t1->next = cur; t1 = cur; }
        else { t2->next = cur; t2 = cur; }
        cur = cur->next;
    }
    t2->next = nullptr;
    t1->next = d2.next;
    t0->next = d1.next;
    return d0.next;
}`,
        variations: [],
        gotchas: ["Just swapping `.val` fields (instead of relinking nodes) is a much simpler solution if the question doesn't require actually rewiring the nodes — always check which one is actually being asked for."]
      }
    ]
  },

  {
    id: "merge-sort-ll",
    name: "Divide & Merge",
    color: "#6bcf7f",
    icon: "merge-sort-ll",
    trigger: "Sort an entire linked list · merge many already-sorted lists together",
    summary: "Linked lists can't be split and rejoined randomly like arrays, but they're a perfect fit for merge sort — splitting in half is easy, and merging two sorted lists is a clean, well-known trick.",
    problems: [
      {
        name: "Sort List",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/sort-list/",
        idea: "Use merge sort: find the middle of the list with the fast/slow pointer trick and split it into two halves, sort each half the same way, then merge the two sorted halves back together using the standard merge-two-sorted-lists trick.",
        time: "O(n log n)", space: "O(log n) for the recursion",
        code: `// 1. base case: 0 or 1 nodes is already sorted
// 2. find the middle with fast/slow pointers, split into two halves
// 3. recursively sort each half
// 4. merge the two sorted halves (same as Merge Two Sorted Lists)
ListNode* sortList(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode *slow = head, *fast = head->next;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    ListNode* mid = slow->next;
    slow->next = nullptr;
    ListNode* left = sortList(head);
    ListNode* right = sortList(mid);
    return mergeTwoLists(left, right); // same merge as Merge Two Sorted Lists
}`,
        variations: [],
        gotchas: ["Remember to actually cut the list into two separate halves (set the middle node's `next` to null) — forgetting this creates an infinite loop."]
      },
      {
        name: "Merge K Sorted Lists",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/merge-k-sorted-lists/",
        idea: "The simplest approach: merge the lists two at a time, the same way you'd merge two sorted lists, and keep repeating until only one list remains — that's really merge sort applied to a list of lists. A small priority queue (min-heap) that always grabs the smallest current node across all the lists is a faster, more scalable way to do it.",
        time: "O(n log k) with a heap, where n is total nodes and k is the number of lists", space: "O(k) for the heap",
        code: `// Option A: repeatedly merge pairs of lists until one remains (merge-sort style)
// Option B: put the head of every list into a min-heap, always pop the smallest,
// push its ->next back in, and repeat until the heap is empty
ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
    for (ListNode* node : lists) if (node) pq.push(node);
    ListNode dummy(0);
    ListNode* cur = &dummy;
    while (!pq.empty()) {
        ListNode* smallest = pq.top(); pq.pop();
        cur->next = smallest;
        cur = cur->next;
        if (smallest->next) pq.push(smallest->next);
    }
    return dummy.next;
}`,
        variations: [],
        gotchas: ["Pairwise merging is easy to write, but the heap approach scales much better as k grows — it's usually the answer interviewers are hoping for."]
      },
      {
        name: "Flattening a Linked List",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/flatten-a-linked-list-with-next-and-child-pointers/",
        idea: "Each node in the top-level list has its own sorted sub-list hanging off a `child` pointer. This is really 'Merge K Sorted Lists' wearing a disguise — instead of an array of k lists, you're given them one at a time via `next`. Merge the last two sub-lists together, then merge that result with the next one over, working backward (or recursively) until only one fully sorted chain remains.",
        time: "O(N) total nodes across all merges", space: "O(1) extra (O(n) if done recursively, for the call stack)",
        code: `// merge two sorted "child" chains, just like Merge Two Sorted Lists,
// but linking through ->child instead of ->next
Node* mergeChildLists(Node* a, Node* b) {
    Node dummy(0);
    Node* tail = &dummy;
    while (a && b) {
        if (a->val <= b->val) { tail->child = a; a = a->child; }
        else { tail->child = b; b = b->child; }
        tail = tail->child;
    }
    tail->child = a ? a : b;
    return dummy.child;
}
// then merge every top-level node's child-list into one, one at a time
Node* flatten(Node* head) {
    Node* cur = head;
    Node* result = nullptr;
    while (cur) {
        result = result ? mergeChildLists(result, cur) : cur;
        cur = cur->next;
    }
    return result;
}`,
        variations: [],
        gotchas: ["Once you notice this is just repeated 'Merge Two Sorted Lists', the hard difficulty rating stops feeling so intimidating."]
      }
    ]
  },

  {
    id: "rewiring",
    name: "In-Place Node Rewiring",
    color: "#f26b9d",
    icon: "rewiring",
    trigger: "Rearranging nodes without extra memory · copying a list that has extra or unusual pointers",
    summary: "Carefully re-point a handful of `next` (and sometimes `random`) pointers directly, instead of building a whole new list or needing extra memory to track where things map to.",
    problems: [
      {
        name: "Reorder List",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/reorder-list/",
        idea: "The reordering pattern (first, last, second, second-to-last, ...) is really just: find the middle, reverse the second half, and then weave the two halves together by alternating nodes from each one.",
        time: "O(n)", space: "O(1)",
        code: `// 1. find the middle with fast/slow pointers
// 2. reverse the second half
// 3. weave: alternate attaching nodes from the first half and the reversed second half
void reorderList(ListNode* head) {
    if (!head || !head->next) return;
    ListNode *slow = head, *fast = head;
    while (fast->next && fast->next->next) { slow = slow->next; fast = fast->next->next; }
    ListNode* second = slow->next;
    slow->next = nullptr;
    ListNode* prev = nullptr;
    while (second) { ListNode* next = second->next; second->next = prev; prev = second; second = next; }
    second = prev;
    ListNode* first = head;
    while (second) {
        ListNode *firstNext = first->next, *secondNext = second->next;
        first->next = second;
        if (firstNext) second->next = firstNext;
        first = firstNext;
        second = secondNext;
    }
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Copy List with Random Pointer",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/copy-list-with-random-pointer/",
        idea: "The tricky part is copying the `random` pointers, since they can point anywhere in the list — including nodes you haven't made a copy of yet. The clean trick: weave a copy right next to each original node (original, copy, original, copy...). Now any node's copy is simply `original.next`, which makes setting up `random` pointers on the copies easy. Afterward, unweave the two lists back apart.",
        time: "O(n)", space: "O(1) extra (not counting the output list)",
        code: `// 1. weave: insert a copy right after each original node
// 2. set copy->random = original->random->next for every original node
// 3. unweave: separate the original list and the new copied list back apart
Node* copyRandomList(Node* head) {
    if (!head) return nullptr;
    for (Node* cur = head; cur; cur = cur->next->next) {
        Node* copy = new Node(cur->val);
        copy->next = cur->next;
        cur->next = copy;
    }
    for (Node* cur = head; cur; cur = cur->next->next) {
        if (cur->random) cur->next->random = cur->random->next;
    }
    Node* newHead = head->next;
    for (Node* cur = head; cur; cur = cur->next) {
        Node* copy = cur->next;
        cur->next = copy->next;
        if (copy->next) copy->next = copy->next->next;
    }
    return newHead;
}`,
        variations: [],
        gotchas: ["Unweaving carefully at the end is easy to get wrong — double check both the original list's and the copy's `next` pointers end up clean, not tangled together."]
      },
      {
        name: "Odd Even Linked List",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/odd-even-linked-list/",
        idea: "Build two separate chains as you walk through the list once — one collecting nodes at odd positions, one collecting nodes at even positions — then simply attach the even chain onto the end of the odd chain.",
        time: "O(n)", space: "O(1)",
        code: `ListNode* oddEvenList(ListNode* head) {
    if (!head) return head;
    ListNode *odd = head, *even = head->next, *evenHead = even;
    while (even && even->next) {
        odd->next = even->next;
        odd = odd->next;
        even->next = odd->next;
        even = even->next;
    }
    odd->next = evenHead;
    return head;
}`,
        variations: [],
        gotchas: []
      }
    ]
  },

  {
    id: "doubly-linked-list",
    name: "Doubly Linked List",
    color: "#e0895f",
    icon: "doubly-linked-list",
    trigger: "Anything where you need to walk backward too — DLL problems are usually 'the same array trick, but on a list that can go both directions'",
    summary: "A doubly linked list adds a `prev` pointer alongside `next`, so every node knows both its neighbors. That backward link is what makes tricks like two-pointer-from-both-ends possible on a list, not just an array.",
    problems: [
      {
        name: "Introduction to a Doubly Linked List",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/doubly-linked-list/",
        idea: "Same idea as a regular linked list, but every node also keeps a `prev` pointer back to the node before it. That second pointer costs a little extra memory per node, but it means you can walk the list in either direction and delete a node without needing to track down its predecessor separately.",
        time: "O(1) to create a node", space: "O(1) per node",
        code: `struct DLLNode {
    int val;
    DLLNode *prev, *next;
    DLLNode(int x) : val(x), prev(nullptr), next(nullptr) {}
};`,
        variations: [],
        gotchas: ["Every time you rewire a `next` pointer, remember to rewire the matching `prev` pointer on the other side too — that's the #1 source of DLL bugs."]
      },
      {
        name: "Insert a Node Before the Head (DLL)",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/insert-a-node-in-doubly-linked-list/",
        idea: "Point the new node's `next` at the current head, and the current head's `prev` back at the new node. Then the new node becomes the head. Two pointer updates instead of one, since there are two directions to maintain now.",
        time: "O(1)", space: "O(1)",
        code: `DLLNode* insertBeforeHead(DLLNode* head, int val) {
    DLLNode* node = new DLLNode(val);
    node->next = head;
    if (head) head->prev = node;
    return node; // new head
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Delete the Head Node (DLL)",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/delete-a-node-in-doubly-linked-list/",
        idea: "Move the head pointer to the second node, then clear that node's `prev` pointer since it no longer has anything before it. In a singly linked list you don't need that second step — this is exactly the kind of extra bookkeeping a `prev` pointer costs you.",
        time: "O(1)", space: "O(1)",
        code: `DLLNode* deleteHead(DLLNode* head) {
    if (!head) return nullptr;
    DLLNode* newHead = head->next;
    if (newHead) newHead->prev = nullptr;
    return newHead;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Reverse a Doubly Linked List",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/reverse-a-doubly-linked-list/",
        idea: "At each node, simply swap its `prev` and `next` pointers with each other. Do that for every node, then the list's old tail becomes the new head. It's simpler than reversing a singly linked list in some ways, since you don't need to track a separate 'previous node' variable — each node already knows its own neighbors.",
        time: "O(n)", space: "O(1)",
        code: `DLLNode* reverseDLL(DLLNode* head) {
    DLLNode *cur = head, *newHead = head;
    while (cur) {
        DLLNode* temp = cur->prev;
        cur->prev = cur->next;
        cur->next = temp;
        newHead = cur;
        cur = cur->prev; // old ->next, since we just swapped
    }
    return newHead;
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Delete All Occurrences of a Key in a DLL",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/delete-all-occurrences-of-a-given-key-in-a-doubly-linked-list/",
        idea: "Walk through the list once. Whenever a node's value matches the key, rewire its neighbors to point directly at each other — the node's `prev.next` skips forward to its `next`, and that `next.prev` skips backward to its `prev` — cutting the matching node out cleanly in both directions.",
        time: "O(n)", space: "O(1)",
        code: `DLLNode* deleteAllOccurrences(DLLNode* head, int key) {
    DLLNode* cur = head;
    while (cur) {
        DLLNode* nextNode = cur->next;
        if (cur->val == key) {
            if (cur->prev) cur->prev->next = cur->next; else head = cur->next;
            if (cur->next) cur->next->prev = cur->prev;
        }
        cur = nextNode;
    }
    return head;
}`,
        variations: [],
        gotchas: ["If the very first node is a match, there's no `prev` to rewire — you have to update `head` itself instead."]
      },
      {
        name: "Find Pairs with a Given Sum in a Sorted DLL",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/find-pairs-with-given-sum-doubly-linked-list/",
        idea: "This is the array two-pointer trick, made possible here specifically because a DLL can walk backward. Start one pointer at the head and one at the tail. If the sum is too small, move the front pointer forward; if too big, move the back pointer backward — exactly like Two Sum on a sorted array, just using `next`/`prev` instead of array indices.",
        time: "O(n)", space: "O(1)",
        code: `vector<pair<int,int>> findPairsWithSum(DLLNode* head, int target) {
    DLLNode *left = head, *right = head;
    while (right->next) right = right->next; // walk to the tail first
    vector<pair<int,int>> pairs;
    while (left != right && left->prev != right) {
        int sum = left->val + right->val;
        if (sum == target) { pairs.push_back({left->val, right->val}); left = left->next; right = right->prev; }
        else if (sum < target) left = left->next;
        else right = right->prev;
    }
    return pairs;
}`,
        variations: [],
        gotchas: ["This trick only works because the DLL is sorted AND can walk backward — a singly linked list would need a totally different approach (like hashing)."]
      },
      {
        name: "Remove Duplicates from a Sorted DLL",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/remove-duplicates-from-a-sorted-doubly-linked-list/",
        idea: "Since the list is sorted, duplicates are always sitting right next to each other. Walk through once, and whenever the current node's value matches the next one's, snip the next one out by rewiring pointers around it, same as any other DLL deletion.",
        time: "O(n)", space: "O(1)",
        code: `DLLNode* removeDuplicates(DLLNode* head) {
    DLLNode* cur = head;
    while (cur && cur->next) {
        if (cur->val == cur->next->val) {
            DLLNode* dup = cur->next;
            cur->next = dup->next;
            if (dup->next) dup->next->prev = cur;
        } else {
            cur = cur->next;
        }
    }
    return head;
}`,
        variations: [],
        gotchas: ["Only advance `cur` when there's NOT a duplicate — after removing one, the new `cur.next` might be a duplicate too, so check again before moving on."]
      }
    ]
  }
];

// Quick-reference: keyword → pattern, used by the pattern finder
const TRIGGER_TABLE = [
  { keyword: "Creating, inserting, deleting, or searching a node by hand", pattern: "ll-basics" },
  { keyword: "Detect a cycle, or find the middle node", pattern: "fast-slow-pointers" },
  { keyword: "Reverse the whole list, or part of it", pattern: "reversal" },
  { keyword: "\"Nth node from the end\", in one pass", pattern: "gap-technique" },
  { keyword: "The head itself might change or get removed", pattern: "dummy-node" },
  { keyword: "Sort a list, or merge several sorted lists", pattern: "merge-sort-ll" },
  { keyword: "Rearranging nodes or copying complex pointers", pattern: "rewiring" },
  { keyword: "The list can walk backward too (has a prev pointer)", pattern: "doubly-linked-list" }
];

  window.TOPIC_REGISTRY = window.TOPIC_REGISTRY || {};
  window.TOPIC_REGISTRY.linkedlist = { topic: TOPIC, patterns: PATTERNS, triggerTable: TRIGGER_TABLE };
})();