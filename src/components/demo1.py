class Node:
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        last = self.head
        while last.next:
            last = last.next
        last.next = new_node
        new_node.prev = last

    def display(self):
        current = self.head
        result = []
        while current:
            result.append(current.data)
            current = current.next
        return result

    def display_reverse(self):
        current = self.head
        if not current:
            return []
        while current.next:
            current = current.next
        result = []
        while current:
            result.append(current.data)
            current = current.prev
        return result

dll = DoublyLinkedList()
dll.append(1)
dll.append(2)
dll.append(3)
dll.append(4)
dll.append(5)

forward_display = dll.display()
reverse_display = dll.display_reverse()

forward_display, reverse_display
