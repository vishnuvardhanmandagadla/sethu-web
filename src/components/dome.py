class Node:
    def __init__(self, val):
        self.data = val
        self.link = None

class LinkedList:
    def __init__(self):
        self.head = None

    def isempty(self):
        # Check if the list is empty
        return self.head is None

    def insert_node_start(self, val):
        new_node = Node(val)
        new_node.link = self.head
        self.head = new_node
def delete_node_start(self):
    if (self.isEmpty()):
        print("delete_node_start: LinkedList is Empty,,,,...")
        return
    self.head=self.head.link
    def insert_node_mid(self, val, key_node):
        if self.head is None:
            print("Key node", key_node, "not found in the list.")
            return
        
        if self.head.data == key_node:
            self.insert_node_start(val)
            return
        
        new_node = Node(val)
        temp = self.head
        
        while temp is not None:
            if temp.data == key_node:
                new_node.link = temp.link
                temp.link = new_node
                return
            
            temp = temp.link
        
        print("Key node", key_node, "not found in the list.")

    def insert_node_end(self, val):
        new_node = Node(val)

        if self.head is None:
            self.head = new_node
            return

        temp = self.head
        while temp.link is not None:
            temp = temp.link
        temp.link = new_node

    def delete_node(self, key):
        # Check if the list is empty
        if self.isempty():
            print("The linked list is empty, cannot delete.")
            return
        
        # If the head node is the one to delete
        if self.head.data == key:
            print(f"Deleting {key} from the start of the list.")
            self.head = self.head.link
            return

        # Traverse to find the node to delete
        temp = self.head
        prev = None
        while temp is not None:
            if temp.data == key:
                print(f"Deleting {key} from the list.")
                prev.link = temp.link
                return
            prev = temp
            temp = temp.link

        # Key not found in the list
        print(f"Node with value {key} not found in the list.")

    def traverse(self):
        print("Traverse:", end=" ")
        if self.isempty():
            print("LinkedList is empty")
            return

        temp = self.head
        while temp is not None:
            print(temp.data, end=" --> ")
            temp = temp.link
        print("None")


# Example usage
l1 = LinkedList()
l1.traverse()          
l1.insert_node_end(60) 
l1.traverse()          
l1.insert_node_end(70) 
l1.traverse()          
l1.insert_node_end(80) 
l1.traverse()          
l1.insert_node_start(50)
l1.traverse()
l1.insert_node_mid(200, 80)
l1.traverse()
l1.insert_node_end(10)
l1.traverse()

# Deleting nodes
l1.delete_node(50)   # Delete head
l1.traverse()

l1.delete_node(70)   # Delete middle node
l1.traverse()

l1.delete_node(100)  # Try to delete a non-existent node
l1.traverse()

l1.delete_node(80)   # Delete a node
l1.traverse()

l1.delete_node(10)   # Delete last node
l1.traverse()